const config = require('../config/config.js');

/**
 * 统一请求封装
 * - 自动拼接 baseUrl
 * - 自动携带用户 token（请求头名：authentication）
 * - 统一处理 code !== 1 的业务错误与 401 登录失效
 */
function request({ url, method = 'GET', data = {}, header = {}, showError = true }) {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token') || '';
    wx.request({
      url: config.baseUrl + url,
      method,
      data,
      header: Object.assign(
        {
          'content-type': 'application/json',
          [config.tokenName]: token
        },
        header
      ),
      success(res) {
        // 登录失效：清理并回登录页
        if (res.statusCode === 401) {
          wx.removeStorageSync('token');
          wx.reLaunch({ url: '/pages/login/login' });
          reject(res.data || { msg: '登录已失效' });
          return;
        }
        const body = res.data || {};
        if (body.code === 1) {
          resolve(body.data);
        } else {
          if (showError) {
            wx.showToast({ title: body.msg || '请求失败，请稍后再试', icon: 'none' });
          }
          reject(body);
        }
      },
      fail(err) {
        if (showError) {
          wx.showToast({ title: '网络异常，请检查后端服务是否启动', icon: 'none' });
        }
        reject(err);
      }
    });
  });
}

module.exports = {
  get: (url, data, options = {}) => request(Object.assign({ url, method: 'GET', data }, options)),
  post: (url, data, options = {}) => request(Object.assign({ url, method: 'POST', data }, options)),
  put: (url, data, options = {}) => request(Object.assign({ url, method: 'PUT', data }, options)),
  del: (url, data, options = {}) => request(Object.assign({ url, method: 'DELETE', data }, options))
};
