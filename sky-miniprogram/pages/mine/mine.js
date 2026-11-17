const app = getApp();

Page({
  data: {
    nickName: '',
    avatarUrl: ''
  },

  onShow() {
    if (!app.checkLogin()) return;
    // 读取本地缓存的用户信息（新版 wx.getUserProfile 需在用户手势中调用，这里仅做展示）
    const profile = wx.getStorageSync('userProfile') || {};
    this.setData({
      nickName: profile.nickName || '',
      avatarUrl: profile.avatarUrl || ''
    });
  },

  goOrders() {
    wx.switchTab({ url: '/pages/orders/orders' });
  },

  goAddress() {
    wx.navigateTo({ url: '/pages/address/address' });
  },

  goAI() {
    wx.navigateTo({ url: '/pages/ai/ai' });
  },

  contactService() {
    wx.showModal({
      title: '联系商家',
      content: '如有用餐问题，可在订单详情页使用「催单」功能，或拨打商家电话咨询。',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  logout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出当前账号吗？',
      success: (res) => {
        if (res.confirm) {
          app.logout();
        }
      }
    });
  }
});
