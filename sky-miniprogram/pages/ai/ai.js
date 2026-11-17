const aiService = require('../../utils/ai.js');

Page({
  data: {
    messages: [],        // [{role, content}] 保留最近 20 条作为上下文
    inputValue: '',
    thinking: false,
    showQuick: true,
    quickQuestions: aiService.QUICK_QUESTIONS,
    scrollToView: ''
  },

  onLoad() {
    // 开场欢迎语
    this.appendMessage(
      'assistant',
      '你好呀 👋 我是小穹，苍穹外卖的智能助手！\n可以帮你推荐菜品、解答下单/配送/取消订单等问题，点击下方快捷问题或直接输入都可以～'
    );
  },

  onInput(e) {
    this.setData({ inputValue: e.detail.value });
  },

  onQuickTap(e) {
    const q = e.currentTarget.dataset.q;
    this.setData({ inputValue: q });
    this.onSend();
  },

  async onSend() {
    const text = (this.data.inputValue || '').trim();
    if (!text || this.data.thinking) return;

    this.appendMessage('user', text);
    this.setData({ inputValue: '', thinking: true, showQuick: false });

    try {
      // 携带最近 20 条消息作为上下文
      const context = this.data.messages.slice(-20).map((m) => ({
        role: m.role,
        content: m.content
      }));
      const reply = await aiService.sendMessage(context);
      this.appendMessage('assistant', reply);
    } catch (e) {
      this.appendMessage('assistant', '网络有点忙，请稍后再试 🙏');
    } finally {
      this.setData({ thinking: false, showQuick: true });
    }
  },

  appendMessage(role, content) {
    const messages = this.data.messages.concat([{ role, content }]);
    this.setData(
      {
        messages,
        scrollToView: `msg-${messages.length - 1}`
      }
    );
  }
});
