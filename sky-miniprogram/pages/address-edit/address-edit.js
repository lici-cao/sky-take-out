const app = getApp();
const api = require('../../utils/api.js');

Page({
  data: {
    id: '',
    region: '',
    form: {
      consignee: '',
      phone: '',
      sex: '1',
      detail: '',
      isDefault: 0
    }
  },

  onLoad(options) {
    if (!app.checkLogin()) return;
    if (options.id) {
      this.setData({ id: options.id });
      wx.setNavigationBarTitle({ title: '编辑收货地址' });
      this.loadDetail(options.id);
    }
  },

  async loadDetail(id) {
    try {
      const addr = await api.addressDetail(id);
      this.setData({
        form: {
          consignee: addr.consignee || '',
          phone: addr.phone || '',
          sex: addr.sex || '1',
          detail: addr.detail || '',
          isDefault: addr.isDefault || 0
        },
        region: `${addr.provinceName || ''}${addr.cityName || ''}${addr.districtName || ''}`
      });
    } catch (e) { /* 已统一提示 */ }
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    if (field === 'region') {
      this.setData({ region: e.detail.value });
    } else {
      this.setData({ [`form.${field}`]: e.detail.value });
    }
  },

  onSexTap(e) {
    this.setData({ 'form.sex': e.currentTarget.dataset.sex });
  },

  onDefaultChange(e) {
    this.setData({ 'form.isDefault': e.detail.value ? 1 : 0 });
  },

  validate() {
    const { consignee, phone, detail } = this.data.form;
    if (!consignee.trim()) return '请填写收货人姓名';
    if (!/^1\d{10}$/.test(phone)) return '请填写正确的 11 位手机号';
    if (!detail.trim()) return '请填写详细地址';
    return '';
  },

  async onSave() {
    const err = this.validate();
    if (err) {
      wx.showToast({ title: err, icon: 'none' });
      return;
    }
    // 省市区按空格拆分（小程序基础版简化处理，后端主要使用 detail 展示）
    const parts = (this.data.region || '').split(/[\s,，]+/).filter(Boolean);
    const data = Object.assign({}, this.data.form, {
      id: this.data.id || undefined,
      provinceCode: '440000',
      provinceName: parts[0] || '广东省',
      cityCode: '440300',
      cityName: parts[1] || '深圳市',
      districtCode: '440305',
      districtName: parts[2] || '南山区',
      label: '家'
    });
    try {
      if (this.data.id) {
        await api.addressUpdate(data);
      } else {
        await api.addressSave(data);
      }
      wx.showToast({ title: '已保存', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 600);
    } catch (e) { /* 已统一提示 */ }
  },

  onDelete() {
    wx.showModal({
      title: '删除地址',
      content: '确定要删除该收货地址吗？',
      success: async (res) => {
        if (!res.confirm) return;
        try {
          await api.addressDelete(this.data.id);
          wx.showToast({ title: '已删除', icon: 'success' });
          setTimeout(() => wx.navigateBack(), 600);
        } catch (e) { /* 已统一提示 */ }
      }
    });
  }
});
