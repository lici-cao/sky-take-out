const app = getApp();
const api = require('../../utils/api.js');
const { orderStatusText, formatTime, formatAmount } = require('../../utils/util.js');

Page({
  data: {
    tabs: [
      { label: '全部', value: 0 },
      { label: '待付款', value: 1 },
      { label: '待接单', value: 2 },
      { label: '已接单', value: 3 },
      { label: '派送中', value: 4 },
      { label: '已完成', value: 5 },
      { label: '已取消', value: 6 }
    ],
    status: 0,
    page: 1,
    pageSize: 10,
    hasMore: true,
    loading: false,
    orders: []
  },

  onShow() {
    if (!app.checkLogin()) return;
    this.refresh();
  },

  onPullDownRefresh() {
    this.refresh().then(() => wx.stopPullDownRefresh());
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadOrders();
    }
  },

  onTabTap(e) {
    const status = Number(e.currentTarget.dataset.value);
    if (status === this.data.status) return;
    this.setData({ status });
    this.refresh();
  },

  async refresh() {
    this.setData({ page: 1, hasMore: true, orders: [] });
    await this.loadOrders();
  },

  async loadOrders() {
    if (this.data.loading) return;
    this.setData({ loading: true });
    try {
      const { page, pageSize, status } = this.data;
      const result = await api.orderHistory(page, pageSize, status === 0 ? null : status);
      const records = (result && result.records) || [];
      const mapped = records.map((o) =>
        Object.assign({}, o, {
          statusText: orderStatusText(o.status),
          orderTimeText: formatTime(o.orderTime),
          amountText: formatAmount(o.amount),
          orderDetailList: o.orderDetailList || []
        })
      );
      const total = (result && result.total) || 0;
      this.setData({
        orders: this.data.orders.concat(mapped),
        page: page + 1,
        hasMore: this.data.orders.length + mapped.length < total,
        loading: false
      });
    } catch (e) {
      this.setData({ loading: false });
    }
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/order-detail/order-detail?id=${id}` });
  },

  goPay(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/pay/pay?orderNumber=${item.number}&amount=${item.amount}`
    });
  },

  cancelOrder(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '取消订单',
      content: '确定要取消该订单吗？',
      success: async (res) => {
        if (!res.confirm) return;
        try {
          await api.orderCancel(id);
          wx.showToast({ title: '已取消', icon: 'success' });
          this.refresh();
        } catch (err) { /* 已统一提示 */ }
      }
    });
  },

  async remindOrder(e) {
    try {
      await api.orderReminder(e.currentTarget.dataset.id);
      wx.showToast({ title: '已提醒商家尽快处理', icon: 'none' });
    } catch (err) { /* 已统一提示 */ }
  },

  async repeatOrder(e) {
    try {
      await api.orderRepetition(e.currentTarget.dataset.id);
      wx.showToast({ title: '已加入购物车', icon: 'success' });
      wx.switchTab({ url: '/pages/index/index' });
    } catch (err) { /* 已统一提示 */ }
  },

  goIndex() {
    wx.switchTab({ url: '/pages/index/index' });
  }
});
