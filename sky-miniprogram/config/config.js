/**
 * 全局配置
 * 使用前请将 baseUrl 修改为你的后端服务地址（本机调试保持默认即可，
 * 微信开发者工具需勾选「不校验合法域名」；真机/上线需配置 request 合法域名）
 */
module.exports = {
  // 后端服务地址（sky-server 默认 8080 端口）
  baseUrl: 'http://localhost:8080',

  // 用户端 JWT 请求头名（对应后端 sky.jwt.user-token-name = authentication）
  tokenName: 'authentication',

  /**
   * AI 助手配置
   * enabled = false 时使用内置「本地智能应答」（无需任何外部服务，开箱可用）；
   * enabled = true 时通过 url 调用你自有的 AI 服务：
   *   - 请求：POST { url }，body 为 { messages: [{role, content}] }
   *     若 provider 为 'openai' 则发送 OpenAI 兼容格式（含 model 字段），
   *     并在 Header 携带 Authorization: Bearer {apiKey}
   *   - 响应自动兼容以下结构：{ reply } / { data: { reply } } /
   *     { choices: [{ message: { content } }] }（OpenAI 格式）
   */
  ai: {
    enabled: false,
    url: '',          // 例如：https://api.deepseek.com/v1/chat/completions
    apiKey: '',       // 你的 AI 服务密钥
    model: '',        // 例如：deepseek-chat / gpt-4o-mini
    provider: 'custom', // 'custom' | 'openai'
    systemPrompt:
      '你是「苍穹外卖」小程序的智能助手「小穹」。你可以帮助用户：查询菜品与套餐、' +
      '解答下单/支付/配送/退款问题、介绍店铺营业状态、推荐菜品。' +
      '回答请简洁友好，控制在 120 字以内，适当使用 emoji。'
  }
};
