const app = getApp();
const api = require('../../utils/api.js');

Page({
  data: {
    list: [],
    from: '' // from=submit 表示从提交订单页进入，点击地址后返回并刷新
  },

  onLoad(options) {
    this.setData({ from: options.from || '' });
  },

  onShow() {
    if (!app.checkLogin()) return;
    this.loadList();
  },

  async loadList() {
    try {
      const list = (await api.addressList()) || [];
      this.setData({ list });
    } catch (e) { /* 已统一提示 */ }
  },

  // 从提交订单页进入：选择地址（设默认后返回，提交页 onShow 会重新拉取）
  async onSelect(e) {
    if (this.data.from !== 'submit') return;
    const id = e.currentTarget.dataset.id;
    try {
      await api.addressSetDefault(id);
      wx.navigateBack();
    } catch (err) { /* 已统一提示 */ }
  },

  onEdit(e) {
    wx.navigateTo({ url: `/pages/address-edit/address-edit?id=${e.currentTarget.dataset.id}` });
  },

  onAdd() {
    wx.navigateTo({ url: '/pages/address-edit/address-edit' });
  }
});
