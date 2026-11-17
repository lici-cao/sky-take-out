package com.sky.controller.user;

import com.sky.entity.ShoppingCart;
import com.sky.result.Result;
import com.sky.service.ShoppingCartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 购物车相关接口
 */
@RestController
@RequestMapping("/user/shoppingCart")
@Tag(name = "C端-购物车接口")
@Slf4j
public class ShoppingCartController {

    @Autowired
    private ShoppingCartService shoppingCartService;

    /**
     * 添加购物车
     *
     * @param shoppingCart
     * @return
     */
    @PostMapping("/add")
    @Operation(summary = "添加购物车")
    public Result add(@RequestBody ShoppingCart shoppingCart) {
        log.info("添加购物车：{}", shoppingCart);
        shoppingCartService.add(shoppingCart);
        return Result.success();
    }

    /**
     * 查看购物车
     *
     * @return
     */
    @GetMapping("/list")
    @Operation(summary = "查看购物车")
    public Result<List<ShoppingCart>> list() {
        List<ShoppingCart> list = shoppingCartService.list();
        return Result.success(list);
    }

    /**
     * 删除购物车中一个商品
     *
     * @param shoppingCart
     * @return
     */
    @PostMapping("/sub")
    @Operation(summary = "删除购物车中一个商品")
    public Result sub(@RequestBody ShoppingCart shoppingCart) {
        log.info("删除购物车中一个商品：{}", shoppingCart);
        shoppingCartService.sub(shoppingCart);
        return Result.success();
    }

    /**
     * 清空购物车
     *
     * @return
     */
    @DeleteMapping("/clean")
    @Operation(summary = "清空购物车")
    public Result clean() {
        shoppingCartService.clean();
        return Result.success();
    }
}
