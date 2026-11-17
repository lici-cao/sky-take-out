package com.sky.service;

import com.sky.dto.UserLoginDTO;
import com.sky.entity.User;

public interface UserService {

    /**
     * 微信登录（未配置微信 appid 时采用模拟登录降级，code 即视为用户标识）
     * @param userLoginDTO
     * @return
     */
    User login(UserLoginDTO userLoginDTO);
}
