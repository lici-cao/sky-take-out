package com.sky.service;

import com.sky.dto.OrdersCancelDTO;
import com.sky.dto.OrdersConfirmDTO;
import com.sky.dto.OrdersPageQueryDTO;
import com.sky.dto.OrdersRejectionDTO;
import com.sky.result.PageResult;
import com.sky.vo.OrderStatisticsVO;
import com.sky.vo.OrderVO;

public interface OrderService {

    /**
     * 订单条件搜索
     * @param ordersPageQueryDTO
     * @return
     */
    PageResult conditionSearch(OrdersPageQueryDTO ordersPageQueryDTO);

    /**
     * 各个状态的订单数量统计
     * @return
     */
    OrderStatisticsVO statistics();

    /**
     * 订单详情
     * @param id
     * @return
     */
    OrderVO details(Long id);

    /**
     * 接单
     * @param ordersConfirmDTO
     */
    void confirm(OrdersConfirmDTO ordersConfirmDTO);

    /**
     * 拒单
     * @param ordersRejectionDTO
     */
    void rejection(OrdersRejectionDTO ordersRejectionDTO);

    /**
     * 取消订单
     * @param ordersCancelDTO
     */
    void cancel(OrdersCancelDTO ordersCancelDTO);

    /**
     * 派送订单
     * @param id
     */
    void delivery(Long id);

    /**
     * 完成订单
     * @param id
     */
    void complete(Long id);

    /**
     * 用户下单
     * @param ordersSubmitDTO
     * @return
     */
    com.sky.vo.OrderSubmitVO submit(com.sky.dto.OrdersSubmitDTO ordersSubmitDTO);

    /**
     * 订单支付（未配置微信支付时模拟支付成功）
     * @param ordersPaymentDTO
     * @return
     */
    com.sky.vo.OrderPaymentVO payment(com.sky.dto.OrdersPaymentDTO ordersPaymentDTO);

    /**
     * 支付成功（模拟支付回调）
     * @param ordersPaymentDTO
     */
    void paySuccess(com.sky.dto.OrdersPaymentDTO ordersPaymentDTO);

    /**
     * 历史订单查询
     * @param ordersPageQueryDTO
     * @return
     */
    com.sky.result.PageResult historyOrders(com.sky.dto.OrdersPageQueryDTO ordersPageQueryDTO);

    /**
     * 用户取消订单
     * @param id
     */
    void userCancelById(Long id);

    /**
     * 再来一单
     * @param id
     */
    void repetition(Long id);

    /**
     * 用户催单
     * @param id
     */
    void reminder(Long id);
}
