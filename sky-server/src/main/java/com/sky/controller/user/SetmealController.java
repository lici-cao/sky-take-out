package com.sky.controller.user;

import com.sky.constant.StatusConstant;
import com.sky.entity.Setmeal;
import com.sky.result.Result;
import com.sky.mapper.SetmealMapper;
import com.sky.vo.DishItemVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 套餐浏览
 */
@RestController("userSetmealController")
@RequestMapping("/user/setmeal")
@Tag(name = "C端-套餐浏览接口")
@Slf4j
public class SetmealController {

    @Autowired
    private SetmealMapper setmealMapper;

    /**
     * 根据分类id查询套餐
     *
     * @param categoryId
     * @return
     */
    @GetMapping("/list")
    @Operation(summary = "根据分类id查询套餐")
    public Result<List<Setmeal>> list(Long categoryId) {
        log.info("根据分类id查询套餐：{}", categoryId);
        List<Setmeal> list = setmealMapper.list(categoryId, StatusConstant.ENABLE);
        return Result.success(list);
    }

    /**
     * 根据套餐id查询包含的菜品
     *
     * @param id
     * @return
     */
    @GetMapping("/dish/{id}")
    @Operation(summary = "根据套餐id查询包含的菜品")
    public Result<List<DishItemVO>> dishList(@PathVariable Long id) {
        log.info("根据套餐id查询包含的菜品：{}", id);
        List<DishItemVO> list = setmealMapper.getDishItemsBySetmealId(id);
        return Result.success(list);
    }
}
