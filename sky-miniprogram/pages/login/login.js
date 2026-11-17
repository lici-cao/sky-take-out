const api = require('../../utils/api.js');

Page({
  data: {
    loading: false
  },

  onLoad() {
    // 已登录直接进入首页
    if (wx.getStorageSync('token')) {
      wx.switchTab({ url: '/pages/index/index' });
    }
  },

  // 微信授权登录：wx.login 拿 code -> 后端换 token
  handleLogin() {
    if (this.data.loading) return;
    this.setData({ loading: true });
    wx.login({
      success: async (res) => {
        if (!res.code) {
          this.setData({ loading: false });
          wx.showToast({ title: '获取登录凭证失败', icon: 'none' });
          return;
        }
        try {
          const data = await api.login(res.code);
          wx.setStorageSync('token', data.token);
          wx.setStorageSync('userInfo', { id: data.id, openid: data.openid });
          wx.switchTab({ url: '/pages/index/index' });
        } catch (e) {
          this.setData({ loading: false });
        }
      },
      fail: () => {
        this.setData({ loading: false });
        wx.showToast({ title: '微信登录失败，请重试', icon: 'none' });
      }
    });
  }
});
