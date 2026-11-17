# 苍穹外卖 · 微信小程序用户端

基于 `sky-take-out`（苍穹外卖）Java 后端接口实现的用户端微信小程序前端工程，页面结构参照用户端产品原型（授权登录 / 首页 / 提交订单 / 支付 / 地址管理 / 历史订单 / 个人中心），并**全局挂载了 AI 智能助手**。

## 目录结构

```
sky-miniprogram/
├── app.js / app.json / app.wxss      # 全局逻辑、路由与样式
├── project.config.json / sitemap.json
├── config/
│   └── config.js                     # ★ 后端地址、token 头名、AI 助手配置
├── utils/
│   ├── request.js                    # 统一请求封装（自动携带 authentication 头）
│   ├── api.js                        # 8 组用户端接口（登录/分类/菜品/套餐/购物车/订单/地址/店铺）
│   ├── util.js                       # 订单状态、金额、时间格式化
│   └── ai.js                         # ★ AI 助手服务（远程大模型 / 本地规则应答双模式）
├── components/
│   └── ai-float/                     # ★ AI 助手全局悬浮入口组件
└── pages/
    ├── login/          # 授权登录（wx.login code 换 token）
    ├── index/          # 首页：分类 + 菜品/套餐 + 口味弹窗 + 购物车（tabBar）
    ├── orders/         # 历史订单：6 种状态筛选、分页、支付/取消/催单/再来一单（tabBar）
    ├── mine/           # 个人中心（tabBar）
    ├── submit/         # 提交订单：地址/送达时间/餐具/备注
    ├── pay/            # 支付页面：15 分钟倒计时 + 微信支付
    ├── order-detail/   # 订单详情：配送进度、商品明细、订单信息
    ├── address/        # 地址管理：列表/默认标识/新增入口
    ├── address-edit/   # 地址新增与编辑
    └── ai/             # ★ AI 助手对话页：气泡聊天、快捷问题、上下文记忆
```

## 快速开始

1. **启动后端**：先运行 `sky-server`（默认 `http://localhost:8080`），并确保 MySQL / Redis 已按原项目说明配置。
2. **导入小程序**：微信开发者工具 → 导入 `sky-miniprogram` 目录（AppID 可选测试号）。
3. **关闭域名校验**：开发阶段在「详情 → 本地设置」勾选 **不校验合法域名**。
4. **修改后端地址**（如需）：编辑 `config/config.js` 中的 `baseUrl`。
5. 进入小程序后自动跳转授权登录页，登录成功即可点餐。

## AI 助手说明

AI 助手「小穹」通过两种方式挂载到小程序：

- **全局悬浮入口**：`components/ai-float` 组件已挂在首页、订单、订单详情、个人中心等页面，随时点击跳转对话页。
- **个人中心菜单入口**：「我的 → AI 智能助手」。

### 两种应答模式（`config/config.js` → `ai` 字段）

| 模式 | 配置 | 说明 |
| --- | --- | --- |
| 本地智能应答（默认） | `enabled: false` | 内置规则库，覆盖推荐菜品、营业时间、配送时长、取消订单、修改地址、支付、催单等高频问题，**零配置开箱即用** |
| 远程大模型 | `enabled: true` 并填写 `url` / `apiKey` / `model` | 支持 OpenAI 兼容接口（`provider: 'openai'`，如 DeepSeek、Kimi、通义等）或自定义接口；远程失败自动降级为本地应答 |

自定义接口协议：`POST { url }`，Body 为 `{ messages: [{role, content}] }`，返回自动兼容 `{reply}` / `{data.reply}` / OpenAI `choices[0].message.content` 三种结构。

## 接口对接说明

- 用户登录：`POST /user/user/login`，`wx.login` 获取的 `code` 换取 `token`，存入本地缓存。
- 之后所有请求自动携带请求头 **`authentication: <token>`**（对应后端 `sky.jwt.user-token-name`）。
- 后端统一返回 `{code, msg, data}`，`code === 1` 为成功，其余弹出错误提示；`401` 自动回登录页。
- 已对接接口：分类 `/user/category/list`、菜品 `/user/dish/list`、套餐 `/user/setmeal/list`、购物车 `/user/shoppingCart/**`、地址簿 `/user/addressBook/**`、订单 `/user/order/**`（submit / payment / historyOrders / orderDetail / cancel / repetition / reminder）、店铺状态 `/user/shop/status`。

## 注意事项

- 真机调试或体验版需将后端域名配置到小程序「request 合法域名」，且必须使用 HTTPS。
- 微信支付需后端配置微信支付商户参数；未配置时后端通常为模拟支付流程，支付页直接调用 `/user/order/payment` 即可。
- 图片资源（菜品图等）使用后端返回的图片地址，请确保后端文件上传/访问路径可达。
