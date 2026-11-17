package com.sky.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.Map;

@Mapper
public interface UserMapper {

    /**
     * 根据动态条件统计用户数量
     * @param map 包含 begin、end
     * @return
     */
    Integer countByMap(Map map);

    /**
     * 根据openid查询用户
     * @param openid
     * @return
     */
    @Select("select * from user where openid = #{openid}")
    com.sky.entity.User getByOpenid(String openid);

    /**
     * 插入用户数据
     * @param user
     */
    void insert(com.sky.entity.User user);
}
