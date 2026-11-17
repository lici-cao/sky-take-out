-- ======================================================================
-- 苍穹外卖 sky-take-out 数据库初始化脚本（补全版）
-- 说明：原项目未提供任何建库建表脚本，本脚本依据实体类与 Mapper XML
--       字段定义补齐 11 张核心业务表及演示数据，使项目可独立初始化运行。
-- 使用：mysql -uroot -p < sky_take_out.sql  或 在 Navicat/DataGrip 中执行
-- 适用数据库：MySQL 8.x（5.7 亦可）
-- ======================================================================

CREATE DATABASE IF NOT EXISTS sky_take_out DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE sky_take_out;

-- ----------------------------------------------------------------------
-- 1. 员工表
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS employee;
CREATE TABLE employee
(
    id          BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
    name        VARCHAR(32)  NOT NULL COMMENT '姓名',
    username    VARCHAR(32)  NOT NULL COMMENT '用户名',
    password    VARCHAR(64)  NOT NULL COMMENT '密码',
    phone       VARCHAR(11)  NOT NULL COMMENT '手机号',
    sex         VARCHAR(2)   NOT NULL COMMENT '性别',
    id_number   VARCHAR(18)  NOT NULL COMMENT '身份证号',
    status      INT          NOT NULL DEFAULT 1 COMMENT '状态 0:禁用，1:启用',
    create_time DATETIME     NOT NULL COMMENT '创建时间',
    update_time DATETIME     NOT NULL COMMENT '更新时间',
    create_user BIGINT       NOT NULL COMMENT '创建人id',
    update_user BIGINT       NOT NULL COMMENT '修改人id',
    PRIMARY KEY (id),
    UNIQUE KEY idx_username (username)
) ENGINE = InnoDB AUTO_INCREMENT = 10 DEFAULT CHARSET = utf8mb4 COMMENT ='员工信息表';

-- 初始管理员账号：admin / 123456（与 EmployeeServiceImpl 明文比对逻辑一致）
INSERT INTO employee (id, name, username, password, phone, sex, id_number, status, create_time, update_time, create_user, update_user)
VALUES (1, '管理员', 'admin', '123456', '13812345678', '1', '110101199001010047', 1, NOW(), NOW(), 1, 1);

-- ----------------------------------------------------------------------
-- 2. 分类表
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS category;
CREATE TABLE category
(
    id          BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
    type        INT          NOT NULL COMMENT '类型 1:菜品分类 2:套餐分类',
    name        VARCHAR(32)  NOT NULL COMMENT '分类名称',
    sort        INT          NOT NULL DEFAULT 0 COMMENT '顺序',
    status      INT          NOT NULL DEFAULT 0 COMMENT '状态 0:禁用，1:启用',
    create_time DATETIME     NOT NULL COMMENT '创建时间',
    update_time DATETIME     NOT NULL COMMENT '更新时间',
    create_user BIGINT       NOT NULL COMMENT '创建人id',
    update_user BIGINT       NOT NULL COMMENT '修改人id',
    PRIMARY KEY (id),
    KEY idx_type (type)
) ENGINE = InnoDB AUTO_INCREMENT = 10 DEFAULT CHARSET = utf8mb4 COMMENT ='菜品及套餐分类';

INSERT INTO category (id, type, name, sort, status, create_time, update_time, create_user, update_user)
VALUES (1, 1, '酒水饮料', 1, 1, NOW(), NOW(), 1, 1),
       (2, 1, '传统主食', 2, 1, NOW(), NOW(), 1, 1),
       (3, 2, '人气套餐', 3, 1, NOW(), NOW(), 1, 1);

-- ----------------------------------------------------------------------
-- 3. 菜品表
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS dish;
CREATE TABLE dish
(
    id          BIGINT        NOT NULL AUTO_INCREMENT COMMENT '主键',
    name        VARCHAR(32)   NOT NULL COMMENT '菜品名称',
    category_id BIGINT        NOT NULL COMMENT '菜品分类id',
    price       DECIMAL(10, 2) NOT NULL COMMENT '菜品价格',
    image       VARCHAR(255)  NOT NULL COMMENT '图片路径',
    description VARCHAR(255)  DEFAULT NULL COMMENT '菜品描述',
    status      INT           NOT NULL DEFAULT 1 COMMENT '状态 0:停售 1:起售',
    create_time DATETIME      NOT NULL COMMENT '创建时间',
    update_time DATETIME      NOT NULL COMMENT '更新时间',
    create_user BIGINT        NOT NULL COMMENT '创建人id',
    update_user BIGINT        NOT NULL COMMENT '修改人id',
    PRIMARY KEY (id),
    KEY idx_category_id (category_id)
) ENGINE = InnoDB AUTO_INCREMENT = 10 DEFAULT CHARSET = utf8mb4 COMMENT ='菜品';

INSERT INTO dish (id, name, category_id, price, image, description, status, create_time, update_time, create_user, update_user)
VALUES (1, '王老吉', 1, 6.00, 'https://sky-take-out.oss-cn-beijing.aliyuncs.com/王老吉.png', '清热解毒，降火消暑', 1, NOW(), NOW(), 1, 1),
       (2, '北冰洋', 1, 8.00, 'https://sky-take-out.oss-cn-beijing.aliyuncs.com/北冰洋.png', '经典汽水，冰爽畅快', 1, NOW(), NOW(), 1, 1),
       (3, '米饭', 2, 3.00, 'https://sky-take-out.oss-cn-beijing.aliyuncs.com/米饭.png', '东北大米，粒粒饱满', 1, NOW(), NOW(), 1, 1),
       (4, '馒头', 2, 2.00, 'https://sky-take-out.oss-cn-beijing.aliyuncs.com/馒头.png', '手工馒头，松软可口', 1, NOW(), NOW(), 1, 1);

-- ----------------------------------------------------------------------
-- 4. 菜品口味表
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS dish_flavor;
CREATE TABLE dish_flavor
(
    id      BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
    dish_id BIGINT       NOT NULL COMMENT '菜品id',
    name    VARCHAR(32)  NOT NULL COMMENT '口味名称',
    value   VARCHAR(255) NOT NULL COMMENT '口味数据json',
    PRIMARY KEY (id),
    KEY idx_dish_id (dish_id)
) ENGINE = InnoDB AUTO_INCREMENT = 10 DEFAULT CHARSET = utf8mb4 COMMENT ='菜品口味关系表';

-- ----------------------------------------------------------------------
-- 5. 套餐表
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS setmeal;
CREATE TABLE setmeal
(
    id          BIGINT        NOT NULL AUTO_INCREMENT COMMENT '主键',
    category_id BIGINT        NOT NULL COMMENT '分类id',
    name        VARCHAR(32)   NOT NULL COMMENT '套餐名称',
    price       DECIMAL(10, 2) NOT NULL COMMENT '套餐价格',
    status      INT           NOT NULL DEFAULT 1 COMMENT '状态 0:停用 1:启用',
    description VARCHAR(255)  DEFAULT NULL COMMENT '描述信息',
    image       VARCHAR(255)  NOT NULL COMMENT '图片',
    create_time DATETIME      NOT NULL COMMENT '创建时间',
    update_time DATETIME      NOT NULL COMMENT '更新时间',
    create_user BIGINT        NOT NULL COMMENT '创建人id',
    update_user BIGINT        NOT NULL COMMENT '修改人id',
    PRIMARY KEY (id),
    KEY idx_category_id (category_id)
) ENGINE = InnoDB AUTO_INCREMENT = 10 DEFAULT CHARSET = utf8mb4 COMMENT ='套餐';

INSERT INTO setmeal (id, category_id, name, price, status, description, image, create_time, update_time, create_user, update_user)
VALUES (1, 3, '一人食简餐', 20.00, 1, '米饭一份+王老吉一罐', 'https://sky-take-out.oss-cn-beijing.aliyuncs.com/一人食简餐.png', NOW(), NOW(), 1, 1);

-- ----------------------------------------------------------------------
-- 6. 套餐菜品关系表
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS setmeal_dish;
CREATE TABLE setmeal_dish
(
    id         BIGINT        NOT NULL AUTO_INCREMENT COMMENT '主键',
    setmeal_id BIGINT        NOT NULL COMMENT '套餐id',
    dish_id    BIGINT        NOT NULL COMMENT '菜品id',
    name       VARCHAR(32)   DEFAULT NULL COMMENT '菜品名称（冗余）',
    price      DECIMAL(10, 2) DEFAULT NULL COMMENT '菜品原价（冗余）',
    copies     INT           NOT NULL DEFAULT 1 COMMENT '份数',
    PRIMARY KEY (id),
    KEY idx_setmeal_id (setmeal_id)
) ENGINE = InnoDB AUTO_INCREMENT = 10 DEFAULT CHARSET = utf8mb4 COMMENT ='套餐菜品关系表';

INSERT INTO setmeal_dish (id, setmeal_id, dish_id, name, price, copies)
VALUES (1, 1, 3, '米饭', 3.00, 1),
       (2, 1, 1, '王老吉', 6.00, 1);

-- ----------------------------------------------------------------------
-- 7. 用户表
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`
(
    id          BIGINT      NOT NULL AUTO_INCREMENT COMMENT '主键',
    openid      VARCHAR(45) NOT NULL COMMENT '微信用户唯一标识',
    name        VARCHAR(32) DEFAULT NULL COMMENT '姓名',
    phone       VARCHAR(11) DEFAULT NULL COMMENT '手机号',
    sex         VARCHAR(2)  DEFAULT NULL COMMENT '性别 0:女 1:男',
    id_number   VARCHAR(18) DEFAULT NULL COMMENT '身份证号',
    avatar      VARCHAR(500) DEFAULT NULL COMMENT '头像',
    create_time DATETIME    NOT NULL COMMENT '注册时间',
    PRIMARY KEY (id),
    UNIQUE KEY idx_openid (openid)
) ENGINE = InnoDB AUTO_INCREMENT = 10 DEFAULT CHARSET = utf8mb4 COMMENT ='用户信息表';

-- ----------------------------------------------------------------------
-- 8. 地址簿表
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS address_book;
CREATE TABLE address_book
(
    id            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
    user_id       BIGINT       NOT NULL COMMENT '用户id',
    consignee     VARCHAR(32)  NOT NULL COMMENT '收货人',
    sex           VARCHAR(2)   DEFAULT NULL COMMENT '性别 0:女 1:男',
    phone         VARCHAR(11)  NOT NULL COMMENT '手机号',
    province_code VARCHAR(12)  DEFAULT NULL COMMENT '省级区划编号',
    province_name VARCHAR(32)  DEFAULT NULL COMMENT '省级名称',
    city_code     VARCHAR(12)  DEFAULT NULL COMMENT '市级区划编号',
    city_name     VARCHAR(32)  DEFAULT NULL COMMENT '市级名称',
    district_code VARCHAR(12)  DEFAULT NULL COMMENT '区级区划编号',
    district_name VARCHAR(32)  DEFAULT NULL COMMENT '区级名称',
    detail        VARCHAR(200) DEFAULT NULL COMMENT '详细地址',
    label         VARCHAR(32)  DEFAULT NULL COMMENT '标签',
    is_default    TINYINT(1)   NOT NULL DEFAULT 0 COMMENT '是否默认 0:否 1:是',
    PRIMARY KEY (id),
    KEY idx_user_id (user_id)
) ENGINE = InnoDB AUTO_INCREMENT = 10 DEFAULT CHARSET = utf8mb4 COMMENT ='地址簿';

-- ----------------------------------------------------------------------
-- 9. 购物车表
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS shopping_cart;
CREATE TABLE shopping_cart
(
    id          BIGINT        NOT NULL AUTO_INCREMENT COMMENT '主键',
    name        VARCHAR(32)   NOT NULL COMMENT '商品名称',
    user_id     BIGINT        NOT NULL COMMENT '用户id',
    dish_id     BIGINT        DEFAULT NULL COMMENT '菜品id',
    setmeal_id  BIGINT        DEFAULT NULL COMMENT '套餐id',
    dish_flavor VARCHAR(50)   DEFAULT NULL COMMENT '口味',
    number      INT           NOT NULL DEFAULT 1 COMMENT '数量',
    amount      DECIMAL(10, 2) NOT NULL COMMENT '金额',
    image       VARCHAR(255)  DEFAULT NULL COMMENT '图片',
    create_time DATETIME      NOT NULL COMMENT '创建时间',
    PRIMARY KEY (id),
    KEY idx_user_id (user_id)
) ENGINE = InnoDB AUTO_INCREMENT = 10 DEFAULT CHARSET = utf8mb4 COMMENT ='购物车';

-- ----------------------------------------------------------------------
-- 10. 订单表
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS orders;
CREATE TABLE orders
(
    id                     BIGINT        NOT NULL AUTO_INCREMENT COMMENT '主键',
    number                 VARCHAR(50)   DEFAULT NULL COMMENT '订单号',
    status                 INT           NOT NULL DEFAULT 1 COMMENT '订单状态 1待付款 2待接单 3已接单 4派送中 5已完成 6已取消',
    user_id                BIGINT        NOT NULL COMMENT '下单用户id',
    address_book_id        BIGINT        NOT NULL COMMENT '地址id',
    order_time             DATETIME      NOT NULL COMMENT '下单时间',
    checkout_time          DATETIME      DEFAULT NULL COMMENT '结账时间',
    pay_method             INT           NOT NULL DEFAULT 1 COMMENT '支付方式 1微信 2支付宝',
    pay_status             INT           NOT NULL DEFAULT 0 COMMENT '支付状态 0未支付 1已支付 2退款',
    amount                 DECIMAL(10, 2) NOT NULL COMMENT '实收金额',
    remark                 VARCHAR(100)  DEFAULT NULL COMMENT '备注',
    phone                  VARCHAR(11)   DEFAULT NULL COMMENT '手机号',
    address                VARCHAR(255)  DEFAULT NULL COMMENT '地址',
    user_name              VARCHAR(32)   DEFAULT NULL COMMENT '用户名',
    consignee              VARCHAR(32)   DEFAULT NULL COMMENT '收货人',
    cancel_reason          VARCHAR(255)  DEFAULT NULL COMMENT '订单取消原因',
    rejection_reason       VARCHAR(255)  DEFAULT NULL COMMENT '订单拒绝原因',
    cancel_time            DATETIME      DEFAULT NULL COMMENT '订单取消时间',
    estimated_delivery_time DATETIME     DEFAULT NULL COMMENT '预计送达时间',
    delivery_status        INT           NOT NULL DEFAULT 1 COMMENT '配送状态 1:立即送出 0:选择具体时间',
    delivery_time          DATETIME      DEFAULT NULL COMMENT '送达时间',
    pack_amount            INT           NOT NULL DEFAULT 0 COMMENT '打包费',
    tableware_number       INT           NOT NULL DEFAULT 0 COMMENT '餐具数量',
    tableware_status       INT           NOT NULL DEFAULT 1 COMMENT '餐具数量状态 1:按餐量提供 0:选择具体数量',
    PRIMARY KEY (id),
    KEY idx_user_id (user_id),
    KEY idx_number (number)
) ENGINE = InnoDB AUTO_INCREMENT = 10 DEFAULT CHARSET = utf8mb4 COMMENT ='订单表';

-- ----------------------------------------------------------------------
-- 11. 订单明细表
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS order_detail;
CREATE TABLE order_detail
(
    id          BIGINT        NOT NULL AUTO_INCREMENT COMMENT '主键',
    name        VARCHAR(32)   NOT NULL COMMENT '名称',
    order_id    BIGINT        NOT NULL COMMENT '订单id',
    dish_id     BIGINT        DEFAULT NULL COMMENT '菜品id',
    setmeal_id  BIGINT        DEFAULT NULL COMMENT '套餐id',
    dish_flavor VARCHAR(50)   DEFAULT NULL COMMENT '口味',
    number      INT           NOT NULL DEFAULT 1 COMMENT '数量',
    amount      DECIMAL(10, 2) NOT NULL COMMENT '金额',
    image       VARCHAR(255)  DEFAULT NULL COMMENT '图片',
    PRIMARY KEY (id),
    KEY idx_order_id (order_id)
) ENGINE = InnoDB AUTO_INCREMENT = 10 DEFAULT CHARSET = utf8mb4 COMMENT ='订单明细表';
