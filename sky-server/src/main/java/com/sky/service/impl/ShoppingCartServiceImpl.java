package com.sky.service.impl;

import com.sky.context.BaseContext;
import com.sky.entity.Dish;
import com.sky.entity.Setmeal;
import com.sky.entity.ShoppingCart;
import com.sky.mapper.DishMapper;
import com.sky.mapper.SetmealMapper;
import com.sky.mapper.ShoppingCartMapper;
import com.sky.service.ShoppingCartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ShoppingCartServiceImpl implements ShoppingCartService {

    @Autowired
    private ShoppingCartMapper shoppingCartMapper;
    @Autowired
    private DishMapper dishMapper;
    @Autowired
    private SetmealMapper setmealMapper;

    /**
     * 添加购物车
     *
     * @param shoppingCart
     */
    public void add(ShoppingCart shoppingCart) {
        //强制归属当前登录用户
        shoppingCart.setUserId(BaseContext.getCurrentId());

        //1、查询当前购物车中是否已存在该商品（同用户、同菜品/套餐、同口味）
        List<ShoppingCart> list = shoppingCartMapper.list(shoppingCart);

        if (list != null && !list.isEmpty()) {
            //2、已存在：数量加1
            ShoppingCart cart = list.get(0);
            cart.setNumber(cart.getNumber() + 1);
            shoppingCartMapper.updateNumberById(cart);
        } else {
            //3、不存在：插入数据，需要补全商品名称、价格、图片信息
            Long dishId = shoppingCart.getDishId();
            Long setmealId = shoppingCart.getSetmealId();
            if (dishId != null) {
                Dish dish = dishMapper.getById(dishId);
                if (dish != null) {
                    shoppingCart.setName(dish.getName());
                    shoppingCart.setAmount(dish.getPrice());
                    shoppingCart.setImage(dish.getImage());
                }
            } else if (setmealId != null) {
                Setmeal setmeal = setmealMapper.getById(setmealId);
                if (setmeal != null) {
                    shoppingCart.setName(setmeal.getName());
                    shoppingCart.setAmount(setmeal.getPrice());
                    shoppingCart.setImage(setmeal.getImage());
                }
            }
            if (shoppingCart.getNumber() == null) {
                shoppingCart.setNumber(1);
            }
            if (shoppingCart.getAmount() == null) {
                shoppingCart.setAmount(BigDecimal.ZERO);
            }
            shoppingCart.setCreateTime(LocalDateTime.now());
            shoppingCartMapper.insert(shoppingCart);
        }
    }

    /**
     * 查看购物车
     *
     * @return
     */
    public List<ShoppingCart> list() {
        ShoppingCart shoppingCart = new ShoppingCart();
        shoppingCart.setUserId(BaseContext.getCurrentId());
        return shoppingCartMapper.list(shoppingCart);
    }

    /**
     * 删除购物车中一个商品
     *
     * @param shoppingCart
     */
    public void sub(ShoppingCart shoppingCart) {
        shoppingCart.setUserId(BaseContext.getCurrentId());

        //查询当前购物车中该商品记录
        List<ShoppingCart> list = shoppingCartMapper.list(shoppingCart);
        if (list == null || list.isEmpty()) {
            return;
        }
        ShoppingCart cart = list.get(0);
        if (cart.getNumber() > 1) {
            //数量大于1：数量减1
            cart.setNumber(cart.getNumber() - 1);
            shoppingCartMapper.updateNumberById(cart);
        } else {
            //数量等于1：直接删除该条记录
            shoppingCartMapper.deleteById(cart.getId());
        }
    }

    /**
     * 清空购物车
     */
    public void clean() {
        shoppingCartMapper.deleteByUserId(BaseContext.getCurrentId());
    }
}
