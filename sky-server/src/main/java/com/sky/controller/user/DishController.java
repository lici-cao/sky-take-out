package com.sky.controller.user;

import com.sky.entity.Category;
import com.sky.entity.Dish;
import com.sky.result.Result;
import com.sky.service.CategoryService;
import com.sky.service.DishService;
import com.sky.vo.DishVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 菜品和分类浏览
 */
@RestController("userDishController")
@RequestMapping("/user/dish")
@Tag(name = "C端-菜品浏览接口")
@Slf4j
public class DishController {

    @Autowired
    private DishService dishService;

    /**
     * 根据分类id查询菜品（含口味信息）
     *
     * @param categoryId
     * @return
     */
    @GetMapping("/list")
    @Operation(summary = "根据分类id查询菜品")
    public Result<List<DishVO>> list(Long categoryId) {
        log.info("根据分类id查询菜品：{}", categoryId);
        List<Dish> dishes = dishService.list(categoryId);

        //转换为DishVO并填充口味信息
        List<DishVO> list = dishes.stream().map(dish -> {
            DishVO dishVO = new DishVO();
            org.springframework.beans.BeanUtils.copyProperties(dish, dishVO);
            dishVO.setFlavors(dishFlavors(dish.getId()));
            return dishVO;
        }).collect(java.util.stream.Collectors.toList());
        return Result.success(list);
    }

    @Autowired
    private com.sky.mapper.DishFlavorMapper dishFlavorMapper;

    private List<com.sky.entity.DishFlavor> dishFlavors(Long dishId) {
        return dishFlavorMapper.getByDishId(dishId);
    }
}
