package com.sky.service.impl;

import com.sky.service.ShopService;
import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicInteger;

/**
 * 店铺营业状态服务
 * 注：当前环境未配置 Redis，使用内存存储店铺状态（重启后恢复为营业中）。
 * 若后续引入 Redis，可将此处替换为 Redis 存取。
 */
@Service
public class ShopServiceImpl implements ShopService {

    /** 店铺营业状态：1营业中 0打烊中，默认营业中 */
    private static final AtomicInteger SHOP_STATUS = new AtomicInteger(1);

    /**
     * 设置店铺营业状态
     *
     * @param status 1营业中 0打烊中
     */
    public void setStatus(Integer status) {
        SHOP_STATUS.set(status);
    }

    /**
     * 查询店铺营业状态
     *
     * @return
     */
    public Integer getStatus() {
        return SHOP_STATUS.get();
    }
}
