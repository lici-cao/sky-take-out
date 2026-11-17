package com.sky.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.sky.constant.MessageConstant;
import com.sky.dto.UserLoginDTO;
import com.sky.entity.User;
import com.sky.exception.LoginFailedException;
import com.sky.mapper.UserMapper;
import com.sky.properties.WeChatProperties;
import com.sky.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDateTime;

@Service
@Slf4j
public class UserServiceImpl implements UserService {

    /** 微信登录接口地址 */
    private static final String WX_LOGIN_URL = "https://api.weixin.qq.com/sns/jscode2session";

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private WeChatProperties weChatProperties;

    /**
     * 微信登录
     *
     * @param userLoginDTO
     * @return
     */
    public User login(UserLoginDTO userLoginDTO) {
        String openid = null;

        //1、优先调用微信接口换取openid；未配置appid时采用模拟登录降级（openid取code），保证本地可测试
        if (weChatProperties.getAppid() != null && !weChatProperties.getAppid().isEmpty()) {
            openid = getOpenidByCode(userLoginDTO.getCode());
        } else {
            log.warn("未配置微信appid/secret，采用模拟登录：openid = mock_{}", userLoginDTO.getCode());
            openid = "mock_" + userLoginDTO.getCode();
        }

        //2、判断当前用户是否为新用户，自动完成注册
        User user = userMapper.getByOpenid(openid);
        if (user == null) {
            user = User.builder()
                    .openid(openid)
                    .createTime(LocalDateTime.now())
                    .build();
            userMapper.insert(user);
        }

        //3、返回用户对象
        return user;
    }

    /**
     * 调用微信接口，通过code换取openid
     *
     * @param code
     * @return
     */
    private String getOpenidByCode(String code) {
        try {
            String url = WX_LOGIN_URL
                    + "?appid=" + weChatProperties.getAppid()
                    + "&secret=" + weChatProperties.getSecret()
                    + "&js_code=" + code
                    + "&grant_type=authorization_code";

            HttpClient httpClient = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(5))
                    .build();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .timeout(Duration.ofSeconds(5))
                    .GET()
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            JSONObject jsonObject = JSONObject.parseObject(response.body());

            String openid = jsonObject.getString("openid");
            if (openid == null || openid.isEmpty()) {
                log.error("微信登录失败：{}", response.body());
                throw new LoginFailedException(MessageConstant.LOGIN_FAILED);
            }
            return openid;
        } catch (LoginFailedException e) {
            throw e;
        } catch (Exception e) {
            log.error("调用微信接口异常：{}", e.getMessage());
            throw new LoginFailedException(MessageConstant.LOGIN_FAILED);
        }
    }
}
