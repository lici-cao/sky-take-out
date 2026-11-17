/**
 * AI 助手悬浮入口组件
 * 用法：
 *   页面 json:  "usingComponents": { "ai-float": "/components/ai-float/ai-float" }
 *   页面 wxml:  <ai-float bottom="160rpx" />
 */
Component({
  properties: {
    // 距底部距离，避免遮挡购物车栏/操作按钮
    bottom: {
      type: String,
      value: '140rpx'
    }
  },
  methods: {
    goAI() {
      wx.navigateTo({ url: '/pages/ai/ai' });
    }
  }
});
