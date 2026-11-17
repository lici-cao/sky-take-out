const app = getApp();
const api = require('../../utils/api.js');

Page({
  data: {
    address: {},
    cartList: [],
    totalAmount: '0.00',
    deliveryType: 1,          // 1 立即送出 2 预约送达
    estimatedTime: '',
    tablewareText: '按餐量提供',
    tablewareStatus: 1,       // 餐具数量状态：1 按餐量提供 0 具体数量/无需餐具
    tablewareNumber: 0,       // 具体餐具份数（按餐量/无需时为 0）
    remark: '',
    canSubmit: false,
    submitting: false
  },

  onShow() {
    if (!app.checkLogin()) return;
    this.loadAddress();
    this.loadCart();
  },

  async loadAddress() {
    try {
      const addr = await api.addressDefault();
      this.setData({ address: addr || {} });
    } catch (e) {
      this.setData({ address: {} });
    }
    this.refreshCanSubmit();
  },

  async loadCart() {
    try {
      const list = (await api.cartList()) || [];
      if (list.length === 0) {
        wx.showToast({ title: '购物车是空的', icon: 'none' });
        setTimeout(() => wx.navigateBack(), 800);
        return;
      }
      let total = 0;
      const cartList = list.map((it) => {
        const amount = Number(it.amount);
        total += amount * it.number;
        return Object.assign({}, it, { amountText: amount.toFixed(2) });
      });
      this.setData({ cartList, totalAmount: total.toFixed(2) });
    } catch (e) { /* 已统一提示 */ }
    this.refreshCanSubmit();
  },

  refreshCanSubmit() {
    this.setData({
      canSubmit: !!this.data.address.id && this.data.cartList.length > 0
    });
  },

  goAddress() {
    wx.navigateTo({ url: '/pages/address/address?from=submit' });
  },

  onTimeTypeTap(e) {
    this.setData({ deliveryType: Number(e.currentTarget.dataset.type) });
  },

  onTimeChange(e) {
    this.setData({ estimatedTime: e.detail.value });
  },

  onTablewareTap() {
    const options = ['按餐量提供', '无需餐具', '1 份', '2 份', '3 份'];
    wx.showActionSheet({
      itemList: options,
      success: (res) => {
        const idx = res.tapIndex;
        let status = 1;   // 默认：按餐量提供
        let number = 0;   // 具体份数，按餐量/无需时为 0
        if (idx === 1) {
          status = 0;     // 无需餐具
        } else if (idx > 1) {
          status = 0;     // 选择具体数量
          number = idx - 1; // 1/2/3 份
        }
        this.setData({
          tablewareText: options[idx],
          tablewareStatus: status,
          tablewareNumber: number
        });
      }
    });
  },

  onRemarkInput(e) {
    this.setData({ remark: e.detail.value });
  },

  async submitOrder() {
    if (!this.data.canSubmit || this.data.submitting) return;
    if (this.data.deliveryType === 2 && !this.data.estimatedTime) {
      wx.showToast({ title: '请选择预约送达时间', icon: 'none' });
      return;
    }
    this.setData({ submitting: true });
    try {
      // 组装提交数据（对应 OrdersSubmitDTO）
      const today = new Date();
      const pad = (n) => (n < 10 ? '0' + n : '' + n);
      const dateStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
      const estimatedDeliveryTime =
        this.data.deliveryType === 2
          ? `${dateStr} ${this.data.estimatedTime}:00`
          : undefined;

      const submitData = {
        addressBookId: this.data.address.id,
        payMethod: 1, // 1 微信支付
        remark: this.data.remark,
        estimatedDeliveryTime,
        deliveryStatus: this.data.deliveryType,
        tablewareStatus: this.data.tablewareStatus,
        tablewareNumber: this.data.tablewareNumber,
        packAmount: 0,
        amount: Number(this.data.totalAmount)
      };

      const result = await api.orderSubmit(submitData);
      // 跳转到支付页
      wx.redirectTo({
        url: `/pages/pay/pay?orderNumber=${result.orderNumber}&orderId=${result.id}&amount=${result.orderAmount}`
      });
    } catch (e) {
      this.setData({ submitting: false });
    }
  }
});
