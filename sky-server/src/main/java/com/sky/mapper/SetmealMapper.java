package com.sky.mapper;

import com.github.pagehelper.Page;
import com.sky.dto.SetmealPageQueryDTO;
import com.sky.entity.Setmeal;
import com.sky.vo.SetmealVO;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface SetmealMapper {

    /**
     * 新增套餐
     * @param setmeal
     */
    void insert(Setmeal setmeal);

    /**
     * 套餐分页查询
     * @param setmealPageQueryDTO
     * @return
     */
    Page<SetmealVO> pageQuery(SetmealPageQueryDTO setmealPageQueryDTO);

    /**
     * 根据id查询套餐
     * @param id
     * @return
     */
    @Select("select * from setmeal where id = #{id}")
    Setmeal getById(Long id);

    /**
     * 修改套餐
     * @param setmeal
     */
    void update(Setmeal setmeal);

    /**
     * 根据id删除套餐
     * @param id
     */
    @Delete("delete from setmeal where id = #{id}")
    void deleteById(Long id);

    /**
     * 根据分类id统计套餐数量
     * @param categoryId
     * @return
     */
    @Select("select count(id) from setmeal where category_id = #{categoryId}")
    Integer countByCategoryId(Long categoryId);

    /**
     * 根据售卖状态统计套餐数量
     * @param status
     * @return
     */
    @Select("select count(id) from setmeal where status = #{status}")
    Integer countByStatus(Integer status);

    /**
     * 根据分类id查询起售中的套餐
     * @param categoryId
     * @param status
     * @return
     */
    @Select("select * from setmeal where category_id = #{categoryId} and status = #{status}")
    List<Setmeal> list(@org.apache.ibatis.annotations.Param("categoryId") Long categoryId, @org.apache.ibatis.annotations.Param("status") Integer status);

    /**
     * 根据套餐id查询包含的菜品
     * @param setmealId
     * @return
     */
    List<com.sky.vo.DishItemVO> getDishItemsBySetmealId(Long setmealId);
}
