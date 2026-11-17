const config = require('../config/config.js');

/**
 * AI 助手服务
 * - config.ai.enabled = true：调用你配置的远程大模型接口
 * - config.ai.enabled = false：使用内置本地规则应答（无需联网配置，开箱即用）
 */

// 常见问题快捷入口
const QUICK_QUESTIONS = [
  '帮我推荐几道菜',
  '现在还能下单吗？',
  '我的订单多久送到？',
  '怎么取消订单？',
  '如何修改收货地址？'
];

/* ---------------- 远程大模型 ---------------- */
function callRemoteAI(messages) {
  const ai = config.ai;
  const isOpenAI = ai.provider === 'openai';
  const body = isOpenAI
    ? {
        model: ai.model || 'gpt-4o-mini',
        messages: [{ role: 'system', content: ai.systemPrompt }].concat(messages)
      }
    : { messages: [{ role: 'system', content: ai.systemPrompt }].concat(messages) };

  return new Promise((resolve, reject) => {
    wx.request({
      url: ai.url,
      method: 'POST',
      timeout: 30000,
      data: body,
      header: {
        'content-type': 'application/json',
        ...(ai.apiKey ? { Authorization: `Bearer ${ai.apiKey}` } : {})
      },
      success(res) {
        const d = res.data || {};
        const reply =
          d.reply ||
          (d.data && d.data.reply) ||
          (d.choices && d.choices[0] && d.choices[0].message && d.choices[0].message.content) ||
          '';
        if (reply) {
          resolve(reply);
        } else {
          reject(new Error('AI 返回格式无法识别'));
        }
      },
      fail: reject
    });
  });
}

/* ---------------- 本地规则应答 ---------------- */
const LOCAL_RULES = [
  {
    keys: ['推荐', '好吃', '招牌', '吃什么', '特色'],
    reply:
      '为你推荐本店人气组合 🍜：招牌套餐 + 时令小炒 + 冰饮，性价比高还不踩雷！' +
      '你可以在首页左侧分类里看看「套餐」和「热销菜品」，加入购物车后告诉我，我还可以帮你看看搭配哦～'
  },
  {
    keys: ['下单', '点餐', '点菜', '怎么买'],
    reply:
      '下单很简单：① 首页挑选菜品/套餐加入购物车 🛒 ② 点击底部「去结算」' +
      '③ 确认收货地址和备注 ④ 提交订单并完成支付。全程不到 1 分钟！'
  },
  {
    keys: ['营业', '打烊', '休息', '还能点'],
    reply:
      '店铺营业状态可以在首页顶部查看：显示「营业中」即可正常下单；' +
      '若显示「休息中」，可以先逛菜单，等开店后再结算哦 ⏰'
  },
  {
    keys: ['多久', '配送', '送到', '骑手', '派送'],
    reply:
      '商家接单后一般 30~45 分钟送达 🛵。你可以在「订单」页实时查看状态：' +
      '待接单 → 已接单 → 派送中 → 已完成。着急的话可以使用「催单」功能提醒商家～'
  },
  {
    keys: ['取消', '退款', '退单'],
    reply:
      '在「订单」页找到对应订单，点击「取消订单」即可（已进入派送的订单建议先联系商家）。' +
      '已支付订单取消后会原路退款，一般 1-3 个工作日到账 💰'
  },
  {
    keys: ['地址', '收货', '送到哪'],
    reply:
      '进入「我的 → 地址管理」即可新增/编辑收货地址，还能设置默认地址，' +
      '下单时会自动带上，超方便 📍'
  },
  {
    keys: ['支付', '付款', '微信'],
    reply:
      '目前支持微信支付 💳。提交订单后请在 15 分钟内完成支付，超时订单会自动取消哦～'
  },
  {
    keys: ['催单', '提醒'],
    reply:
      '在订单详情页点击「催单」，商家会立刻收到提醒 🔔。每个订单可催单一次，请耐心等待骑手小哥～'
  },
  {
    keys: ['优惠', '红包', '券', '便宜'],
    reply:
      '本店不定期推出优惠活动 🎁，套餐比单点更划算！首页「套餐」分类里常有惊喜组合，快去逛逛吧～'
  }
];

function localAI(userText) {
  const text = (userText || '').trim();
  for (const rule of LOCAL_RULES) {
    if (rule.keys.some((k) => text.includes(k))) {
      return rule.reply;
    }
  }
  if (/你好|在吗|hi|hello/i.test(text)) {
    return '你好呀 👋 我是小穹，苍穹外卖的智能助手！可以问我点餐、配送、订单、地址等问题，也可以直接点下方快捷问题～';
  }
  return (
    '收到！这个问题我还在学习中 🤔。你可以试试问我：推荐菜品、营业时间、配送时长、' +
    '取消订单、修改地址等，我很擅长这些哦～'
  );
}

/* ---------------- 对外接口 ---------------- */
/**
 * 发送消息并获取 AI 回复
 * @param {Array} messages 历史消息 [{role: 'user'|'assistant', content: ''}]
 * @returns {Promise<string>} AI 回复文本
 */
function sendMessage(messages) {
  const ai = config.ai;
  if (ai.enabled && ai.url) {
    return callRemoteAI(messages).catch(() => {
      // 远程失败时降级为本地应答，保证助手始终可用
      const lastUser = messages.filter((m) => m.role === 'user').pop();
      return localAI(lastUser ? lastUser.content : '');
    });
  }
  const lastUser = messages.filter((m) => m.role === 'user').pop();
  // 模拟思考延迟，体验更自然
  return new Promise((resolve) => {
    setTimeout(() => resolve(localAI(lastUser ? lastUser.content : '')), 600);
  });
}

module.exports = {
  sendMessage,
  QUICK_QUESTIONS
};
