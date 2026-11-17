const app = getApp();
const api = require('../../utils/api.js');
const { orderStatusText, formatTime, formatAmount } = require('../../utils/util.js');

const STATUS_DESC = {
  1: '请尽快完成支付，超时订单将自动取消',
  2: '商家正在确认您的订单，请稍候',
  3: '商家已接单，正在为您备餐',
  4: '骑手正在快马加鞭配送中',
  5: '订单已完成，感谢惠顾',
  6: '订单已取消'
};

Page({
  data: {
    id: '',
    order: null
  },

  onLoad(options) {
    if (!app.checkLogin()) return;
    this.setData({ id: options.id });
  },

  onShow() {
    if (this.data.id) this.loadDetail();
  },

  async loadDetail() {
    try {
      const o = await api.orderDetail(this.data.id);
      const order = Object.assign({}, o, {
        statusText: orderStatusText(o.status),
        statusDesc: STATUS_DESC[o.status] || '',
        orderTimeText: formatTime(o.orderTime),
        checkoutTimeText: formatTime(o.checkoutTime),
        deliveryTimeText: formatTime(o.deliveryTime),
        amountText: formatAmount(o.amount),
        packAmountText: formatAmount(o.packAmount || 0),
        orderDetailList: (o.orderDetailList || []).map((d) =>
          Object.assign({}, d, { amountText: formatAmount(d.amount) })
        )
      });
      this.setData({ order });
    } catch (e) { /* 已统一提示 */ }
  },

  goPay() {
    wx.navigateTo({
      url: `/pages/pay/pay?orderNumber=${this.data.order.number}&orderId=${this.data.order.id}&amount=${this.data.order.amount}`
    });
  },

  cancelOrder() {
    wx.showModal({
      title: '取消订单',
      content: '确定要取消该订单吗？',
      success: async (res) => {
        if (!res.confirm) return;
        try {
          await api.orderCancel(this.data.id);
          wx.showToast({ title: '已取消', icon: 'success' });
          this.loadDetail();
        } catch (e) { /* 已统一提示 */ }
      }
    });
  },

  async remindOrder() {
    try {
      await api.orderReminder(this.data.id);
      wx.showToast({ title: '已提醒商家尽快处理', icon: 'none' });
    } catch (e) { /* 已统一提示 */ }
  },

  async repeatOrder() {
    try {
      await api.orderRepetition(this.data.id);
      wx.showToast({ title: '已加入购物车', icon: 'success' });
      wx.switchTab({ url: '/pages/index/index' });
    } catch (e) { /* 已统一提示 */ }
  }
});
