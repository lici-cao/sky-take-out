const app = getApp();
const api = require('../../utils/api.js');

Page({
  data: {
    shopStatus: 1,          // 1 营业中 0 休息中
    addressText: '',
    categories: [],         // 合并后的分类 [{key, id, name, type}]
    activeKey: '',
    activeType: 1,          // 1 菜品分类 2 套餐分类
    goodsList: [],
    cartMap: {},            // { 'dish_1': {number,...}, 'setmeal_2': {...} }
    cartCount: 0,
    cartAmount: '0.00',
    cartList: [],
    showCartPopup: false,
    showFlavorPopup: false,
    currentDish: null,
    selectedFlavor: {}
  },

  onLoad() {
    if (!app.checkLogin()) return;
  },

  onShow() {
    if (!app.checkLogin()) return;
    this.init();
  },

  onPullDownRefresh() {
    this.init().then(() => wx.stopPullDownRefresh());
  },

  async init() {
    await Promise.all([
      this.loadShopStatus(),
      this.loadAddress(),
      this.loadCategories(),
      this.loadCart()
    ]);
  },

  /* ---------- 店铺状态 ---------- */
  async loadShopStatus() {
    try {
      const status = await api.getShopStatus();
      this.setData({ shopStatus: status });
      app.globalData.shopStatus = status;
    } catch (e) { /* 已统一提示 */ }
  },

  /* ---------- 默认地址 ---------- */
  async loadAddress() {
    try {
      const addr = await api.addressDefault();
      this.setData({ addressText: addr ? addr.detail : '' });
    } catch (e) {
      this.setData({ addressText: '' });
    }
  },

  goAddress() {
    wx.navigateTo({ url: '/pages/address/address' });
  },

  /* ---------- 分类与商品 ---------- */
  async loadCategories() {
    try {
      const [dishCats, setmealCats] = await Promise.all([
        api.categoryList(1),
        api.categoryList(2)
      ]);
      const categories = (dishCats || [])
        .map((c) => ({ key: `dish_${c.id}`, id: c.id, name: c.name, type: 1 }))
        .concat(
          (setmealCats || []).map((c) => ({ key: `setmeal_${c.id}`, id: c.id, name: c.name, type: 2 }))
        );
      if (categories.length === 0) {
        this.setData({ categories: [], goodsList: [] });
        return;
      }
      const first = categories[0];
      this.setData({ categories, activeKey: first.key, activeType: first.type });
      await this.loadGoods(first);
    } catch (e) { /* 已统一提示 */ }
  },

  onCategoryTap(e) {
    const key = e.currentTarget.dataset.key;
    const cat = this.data.categories.find((c) => c.key === key);
    if (!cat || key === this.data.activeKey) return;
    this.setData({ activeKey: key, activeType: cat.type });
    this.loadGoods(cat);
  },

  async loadGoods(cat) {
    try {
      const list =
        cat.type === 1 ? await api.dishList(cat.id) : await api.setmealList(cat.id);
      const prefix = cat.type === 1 ? 'dish' : 'setmeal';
      const goodsList = (list || []).map((item) => {
        // 口味 value 兼容：后端可能返回 JSON 字符串，统一解析为数组
        const flavors = (item.flavors || []).map((f) => {
          let value = f.value;
          if (typeof value === 'string') {
            try {
              value = JSON.parse(value);
            } catch (err) {
              value = value ? [value] : [];
            }
          }
          return Object.assign({}, f, { value: value || [] });
        });
        return Object.assign({}, item, {
          _key: `${prefix}_${item.id}`,
          _type: cat.type,
          flavors
        });
      });
      this.setData({ goodsList });
    } catch (e) {
      this.setData({ goodsList: [] });
    }
  },

  /* ---------- 加购 ---------- */
  addGoods(e) {
    const item = e.currentTarget.dataset.item;
    if (this.data.shopStatus !== 1) {
      wx.showToast({ title: '店铺休息中，暂不能下单', icon: 'none' });
      return;
    }
    // 菜品含口味则弹窗选择；否则直接加购
    if (item._type === 1 && item.flavors && item.flavors.length > 0) {
      this.setData({ showFlavorPopup: true, currentDish: item, selectedFlavor: {} });
      return;
    }
    this.doAdd(item, '');
  },

  onFlavorTap(e) {
    const { name, value } = e.currentTarget.dataset;
    this.setData({ [`selectedFlavor.${name}`]: value });
  },

  confirmFlavor() {
    const dish = this.data.currentDish;
    // 每组口味都需选择一个值
    for (const f of dish.flavors || []) {
      if (!this.data.selectedFlavor[f.name]) {
        wx.showToast({ title: `请选择${f.name}`, icon: 'none' });
        return;
      }
    }
    const dishFlavor = JSON.stringify(
      Object.keys(this.data.selectedFlavor).map((name) => ({
        name,
        value: [this.data.selectedFlavor[name]]
      }))
    );
    this.setData({ showFlavorPopup: false });
    this.doAdd(dish, dishFlavor);
  },

  async doAdd(item, dishFlavor) {
    try {
      const data =
        item._type === 1
          ? { dishId: item.id, dishFlavor }
          : { setmealId: item.id };
      await api.cartAdd(data);
      await this.loadCart();
    } catch (e) { /* 已统一提示 */ }
  },

  async subGoods(e) {
    const item = e.currentTarget.dataset.item;
    try {
      const data = item._type === 1 ? { dishId: item.id } : { setmealId: item.id };
      await api.cartSub(data);
      await this.loadCart();
    } catch (e) { /* 已统一提示 */ }
  },

  /* ---------- 购物车明细弹层内加减 ---------- */
  async addCartRow(e) {
    const item = e.currentTarget.dataset.item;
    try {
      const data = item.dishId
        ? { dishId: item.dishId, dishFlavor: item.dishFlavor || '' }
        : { setmealId: item.setmealId };
      await api.cartAdd(data);
      await this.loadCart();
    } catch (err) { /* 已统一提示 */ }
  },

  async subCartRow(e) {
    const item = e.currentTarget.dataset.item;
    try {
      const data = item.dishId ? { dishId: item.dishId } : { setmealId: item.setmealId };
      await api.cartSub(data);
      await this.loadCart();
    } catch (err) { /* 已统一提示 */ }
  },

  async cleanCart() {
    try {
      await api.cartClean();
      this.setData({ showCartPopup: false });
      await this.loadCart();
    } catch (e) { /* 已统一提示 */ }
  },

  /* ---------- 购物车状态 ---------- */
  async loadCart() {
    try {
      const list = (await api.cartList()) || [];
      let count = 0;
      let amount = 0;
      const cartMap = {};
      list.forEach((it) => {
        count += it.number;
        amount += Number(it.amount) * it.number;
        const key = it.dishId ? `dish_${it.dishId}` : `setmeal_${it.setmealId}`;
        cartMap[key] = { number: (cartMap[key] ? cartMap[key].number : 0) + it.number };
      });
      this.setData({
        cartList: list,
        cartCount: count,
        cartAmount: amount.toFixed(2),
        cartMap
      });
    } catch (e) { /* 已统一提示 */ }
  },

  toggleCartPopup() {
    if (this.data.cartCount === 0) return;
    this.setData({ showCartPopup: !this.data.showCartPopup });
  },

  closePopups() {
    this.setData({ showCartPopup: false, showFlavorPopup: false });
  },

  /* ---------- 去结算 ---------- */
  goSubmit() {
    if (this.data.cartCount === 0) return;
    if (this.data.shopStatus !== 1) {
      wx.showToast({ title: '店铺休息中，暂不能下单', icon: 'none' });
      return;
    }
    wx.navigateTo({ url: '/pages/submit/submit' });
  }
});
