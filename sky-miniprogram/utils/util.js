/**
 * 通用工具函数
 */

// 订单状态映射（与后端 Orders 状态一致）
const ORDER_STATUS = {
  1: '待付款',
  2: '待接单',
  3: '已接单',
  4: '派送中',
  5: '已完成',
  6: '已取消'
};

function orderStatusText(status) {
  return ORDER_STATUS[status] || '未知状态';
}

// 金额格式化：保留两位小数
function formatAmount(amount) {
  const n = Number(amount || 0);
  return n.toFixed(2);
}

// 时间格式化：2026-09-23T12:00:00 -> 2026-09-23 12:00
function formatTime(input) {
  if (!input) return '';
  if (typeof input === 'string') {
    return input.replace('T', ' ').slice(0, 16);
  }
  const d = new Date(input);
  const pad = (n) => (n < 10 ? '0' + n : '' + n);
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
}

// 隐藏手机号中间四位
function maskPhone(phone) {
  if (!phone || phone.length < 7) return phone || '';
  return phone.slice(0, 3) + '****' + phone.slice(-4);
}

module.exports = {
  ORDER_STATUS,
  orderStatusText,
  formatAmount,
  formatTime,
  maskPhone
};
