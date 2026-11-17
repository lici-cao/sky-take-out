package com.sky.service;

import com.sky.entity.ShoppingCart;

import java.util.List;

public interface ShoppingCartService {

    /**
     * 添加购物车
     * @param shoppingCart
     */
    void add(ShoppingCart shoppingCart);

    /**
     * 查看购物车
     * @return
     */
    List<ShoppingCart> list();

    /**
     * 删除购物车中一个商品
     * @param shoppingCart
     */
    void sub(ShoppingCart shoppingCart);

    /**
     * 清空购物车
     */
    void clean();
}
