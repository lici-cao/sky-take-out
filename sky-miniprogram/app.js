// 苍穹外卖小程序 - 用户端
App({
  globalData: {
    userInfo: null,
    token: '',
    shopStatus: 1 // 1 营业中 0 休息中
  },

  onLaunch() {
    const token = wx.getStorageSync('token');
    if (token) {
      this.globalData.token = token;
    }
  },

  // 校验登录态，未登录跳转授权登录页；返回是否已登录
  checkLogin() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.reLaunch({ url: '/pages/login/login' });
      return false;
    }
    this.globalData.token = token;
    return true;
  },

  // 退出登录，清理本地状态
  logout() {
    wx.removeStorageSync('token');
    wx.removeStorageSync('userInfo');
    this.globalData.token = '';
    this.globalData.userInfo = null;
    wx.reLaunch({ url: '/pages/login/login' });
  }
});
