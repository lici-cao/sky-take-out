const { get, post, put, del } = require('./request.js');

/**
 * 用户端接口（对应 sky-server 的 /user/** 控制器）
 */
const api = {
  /* ---------- 用户 ---------- */
  // 微信登录：code -> { id, openid, token }
  login: (code) => post('/user/user/login', { code }),
  logout: () => post('/user/user/logout'),

  /* ---------- 店铺 ---------- */
  // 营业状态：1 营业中 0 休息中
  getShopStatus: () => get('/user/shop/status'),

  /* ---------- 分类 ---------- */
  // type=1 菜品分类，type=2 套餐分类
  categoryList: (type) => get('/user/category/list', { type }),

  /* ---------- 菜品 / 套餐 ---------- */
  dishList: (categoryId) => get('/user/dish/list', { categoryId }),
  setmealList: (categoryId) => get('/user/setmeal/list', { categoryId }),
  setmealDishList: (setmealId) => get(`/user/setmeal/dish/${setmealId}`),

  /* ---------- 购物车 ---------- */
  cartAdd: (data) => post('/user/shoppingCart/add', data),
  cartSub: (data) => post('/user/shoppingCart/sub', data),
  cartList: () => get('/user/shoppingCart/list'),
  cartClean: () => del('/user/shoppingCart/clean'),

  /* ---------- 地址簿 ---------- */
  addressList: (options = {}) => get('/user/addressBook/list', {}, options),
  // showError:false：无默认地址或后端异常时由页面自行降级，不弹全局错误提示
  addressDefault: () => get('/user/addressBook/default', {}, { showError: false }),
  addressDetail: (id) => get(`/user/addressBook/${id}`),
  addressSave: (data) => post('/user/addressBook', data),
  addressUpdate: (data) => put('/user/addressBook', data),
  addressDelete: (id) => del('/user/addressBook', { id }),
  addressSetDefault: (id) => put('/user/addressBook/default', { id }),

  /* ---------- 订单 ---------- */
  orderSubmit: (data) => post('/user/order/submit', data),
  orderPay: (data) => put('/user/order/payment', data), // { orderNumber, payMethod }
  orderHistory: (page, pageSize, status) => {
    const data = { page, pageSize };
    if (status !== null && status !== undefined) data.status = status;
    return get('/user/order/historyOrders', data);
  },
  orderDetail: (id) => get(`/user/order/orderDetail/${id}`),
  orderCancel: (id) => put(`/user/order/cancel/${id}`),
  orderRepetition: (id) => post(`/user/order/repetition/${id}`),
  orderReminder: (id) => get(`/user/order/reminder/${id}`)
};

module.exports = api;
