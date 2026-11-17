package com.sky.mapper;

import com.sky.entity.OrderDetail;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface OrderDetailMapper {

    /**
     * 根据订单id查询订单明细
     * @param orderId
     * @return
     */
    List<OrderDetail> getByOrderId(Long orderId);

    /**
     * 批量插入订单明细
     * @param orderDetails
     */
    void insertBatch(@Param("orderDetails") List<OrderDetail> orderDetails);
}
