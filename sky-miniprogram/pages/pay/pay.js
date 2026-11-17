const app = getApp();
const api = require('../../utils/api.js');

Page({
  data: {
    orderNumber: '',
    orderId: '',
    amountText: '0.00',
    paying: false,
    countdown: 15 * 60, // 15 分钟倒计时（秒）
    countdownText: '15:00'
  },

  timer: null,

  onLoad(options) {
    if (!app.checkLogin()) return;
    const { orderNumber, orderId, amount } = options;
    this.setData({
      orderNumber: orderNumber || '',
      orderId: orderId || '',
      amountText: Number(amount || 0).toFixed(2)
    });
    this.startCountdown();
  },

  onUnload() {
    if (this.timer) clearInterval(this.timer);
  },

  startCountdown() {
    this.timer = setInterval(() => {
      let s = this.data.countdown - 1;
      if (s <= 0) {
        clearInterval(this.timer);
        this.setData({ countdownText: '已超时' });
        wx.showToast({ title: '支付超时，订单已取消', icon: 'none' });
        setTimeout(() => wx.switchTab({ url: '/pages/orders/orders' }), 1200);
        return;
      }
      const m = Math.floor(s / 60);
      const sec = s % 60;
      this.setData({
        countdown: s,
        countdownText: `${m < 10 ? '0' + m : m}:${sec < 10 ? '0' + sec : sec}`
      });
    }, 1000);
  },

  async handlePay() {
    if (this.data.paying) return;
    this.setData({ paying: true });
    try {
      // 调用后端支付接口（对应 OrderController.payment，返回微信支付参数）
      // 注：未配置微信支付商户号的开发环境下，后端通常会直接模拟支付成功
      await api.orderPay({
        orderNumber: this.data.orderNumber,
        payMethod: 1
      });
      wx.showToast({ title: '支付成功', icon: 'success' });
      setTimeout(() => {
        wx.switchTab({ url: '/pages/orders/orders' });
      }, 1000);
    } catch (e) {
      this.setData({ paying: false });
    }
  },

  cancelPay() {
    wx.switchTab({ url: '/pages/orders/orders' });
  }
});
