package com.sky.mapper;

import com.sky.entity.AddressBook;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface AddressBookMapper {

    /**
     * 新增地址
     * @param addressBook
     */
    void insert(AddressBook addressBook);

    /**
     * 查询当前登录用户的所有地址信息
     * @param addressBook 仅使用 userId 条件
     * @return
     */
    List<AddressBook> list(AddressBook addressBook);

    /**
     * 根据id查询地址
     * @param id
     * @return
     */
    @Select("select * from address_book where id = #{id}")
    AddressBook getById(Long id);

    /**
     * 根据id修改地址
     * @param addressBook
     */
    void update(AddressBook addressBook);

    /**
     * 根据id删除地址
     * @param id
     */
    @Delete("delete from address_book where id = #{id}")
    void deleteById(Long id);

    /**
     * 将该用户所有地址改为非默认
     * @param userId
     */
    @Update("update address_book set is_default = 0 where user_id = #{userId}")
    void updateIsDefaultByUserId(Long userId);

    /**
     * 将指定地址设为默认
     * @param addressBook 仅使用 id 和 isDefault
     */
    void updateIsDefault(AddressBook addressBook);
}
