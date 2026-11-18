-- 苍穹外卖 桌面版 H2 建表脚本（由 db/sky_take_out.sql 转换，幂等）

CREATE TABLE IF NOT EXISTS employee
(
    id          BIGINT       NOT NULL AUTO_INCREMENT ,
    name        VARCHAR(32)  NOT NULL ,
    username    VARCHAR(32)  NOT NULL ,
    password    VARCHAR(64)  NOT NULL ,
    phone       VARCHAR(11)  NOT NULL ,
    sex         VARCHAR(2)   NOT NULL ,
    id_number   VARCHAR(18)  NOT NULL ,
    status      INT          NOT NULL DEFAULT 1 ,
    create_time DATETIME     NOT NULL ,
    update_time DATETIME     NOT NULL ,
    create_user BIGINT DEFAULT NULL ,
    update_user BIGINT DEFAULT NULL ,
    PRIMARY KEY (id),
    UNIQUE (username)
);

CREATE TABLE IF NOT EXISTS category
(
    id          BIGINT       NOT NULL AUTO_INCREMENT ,
    type        INT          NOT NULL ,
    name        VARCHAR(32)  NOT NULL ,
    sort        INT          NOT NULL DEFAULT 0 ,
    status      INT          NOT NULL DEFAULT 0 ,
    create_time DATETIME     NOT NULL ,
    update_time DATETIME     NOT NULL ,
    create_user BIGINT DEFAULT NULL ,
    update_user BIGINT DEFAULT NULL ,
    PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_category_idx_type ON category (type);

CREATE TABLE IF NOT EXISTS dish
(
    id          BIGINT        NOT NULL AUTO_INCREMENT ,
    name        VARCHAR(32)   NOT NULL ,
    category_id BIGINT        NOT NULL ,
    price       DECIMAL(10, 2) NOT NULL ,
    image       VARCHAR(255)  NOT NULL ,
    description VARCHAR(255)  DEFAULT NULL ,
    status      INT           NOT NULL DEFAULT 1 ,
    create_time DATETIME      NOT NULL ,
    update_time DATETIME      NOT NULL ,
    create_user BIGINT DEFAULT NULL ,
    update_user BIGINT DEFAULT NULL ,
    PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_dish_idx_category_id ON dish (category_id);

CREATE TABLE IF NOT EXISTS dish_flavor
(
    id      BIGINT       NOT NULL AUTO_INCREMENT ,
    dish_id BIGINT       NOT NULL ,
    name    VARCHAR(32)  NOT NULL ,
    value   VARCHAR(255) NOT NULL ,
    PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_dish_flavor_idx_dish_id ON dish_flavor (dish_id);

CREATE TABLE IF NOT EXISTS setmeal
(
    id          BIGINT        NOT NULL AUTO_INCREMENT ,
    category_id BIGINT        NOT NULL ,
    name        VARCHAR(32)   NOT NULL ,
    price       DECIMAL(10, 2) NOT NULL ,
    status      INT           NOT NULL DEFAULT 1 ,
    description VARCHAR(255)  DEFAULT NULL ,
    image       VARCHAR(255)  NOT NULL ,
    create_time DATETIME      NOT NULL ,
    update_time DATETIME      NOT NULL ,
    create_user BIGINT DEFAULT NULL ,
    update_user BIGINT DEFAULT NULL ,
    PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_setmeal_idx_category_id ON setmeal (category_id);

CREATE TABLE IF NOT EXISTS setmeal_dish
(
    id         BIGINT        NOT NULL AUTO_INCREMENT ,
    setmeal_id BIGINT        NOT NULL ,
    dish_id    BIGINT        NOT NULL ,
    name       VARCHAR(32)   DEFAULT NULL ,
    price      DECIMAL(10, 2) DEFAULT NULL ,
    copies     INT           NOT NULL DEFAULT 1 ,
    PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_setmeal_dish_idx_setmeal_id ON setmeal_dish (setmeal_id);

CREATE TABLE IF NOT EXISTS user
(
    id          BIGINT      NOT NULL AUTO_INCREMENT ,
    openid      VARCHAR(45) NOT NULL ,
    name        VARCHAR(32) DEFAULT NULL ,
    phone       VARCHAR(11) DEFAULT NULL ,
    sex         VARCHAR(2)  DEFAULT NULL ,
    id_number   VARCHAR(18) DEFAULT NULL ,
    avatar      VARCHAR(500) DEFAULT NULL ,
    create_time DATETIME    NOT NULL ,
    PRIMARY KEY (id),
    UNIQUE (openid)
);

CREATE TABLE IF NOT EXISTS address_book
(
    id            BIGINT       NOT NULL AUTO_INCREMENT ,
    user_id       BIGINT       NOT NULL ,
    consignee     VARCHAR(32)  NOT NULL ,
    sex           VARCHAR(2)   DEFAULT NULL ,
    phone         VARCHAR(11)  NOT NULL ,
    province_code VARCHAR(12)  DEFAULT NULL ,
    province_name VARCHAR(32)  DEFAULT NULL ,
    city_code     VARCHAR(12)  DEFAULT NULL ,
    city_name     VARCHAR(32)  DEFAULT NULL ,
    district_code VARCHAR(12)  DEFAULT NULL ,
    district_name VARCHAR(32)  DEFAULT NULL ,
    detail        VARCHAR(200) DEFAULT NULL ,
    label         VARCHAR(32)  DEFAULT NULL ,
    is_default    TINYINT(1)   NOT NULL DEFAULT 0 ,
    PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_address_book_idx_user_id ON address_book (user_id);

CREATE TABLE IF NOT EXISTS shopping_cart
(
    id          BIGINT        NOT NULL AUTO_INCREMENT ,
    name        VARCHAR(32)   NOT NULL ,
    user_id     BIGINT        NOT NULL ,
    dish_id     BIGINT        DEFAULT NULL ,
    setmeal_id  BIGINT        DEFAULT NULL ,
    dish_flavor VARCHAR(50)   DEFAULT NULL ,
    number      INT           NOT NULL DEFAULT 1 ,
    amount      DECIMAL(10, 2) NOT NULL ,
    image       VARCHAR(255)  DEFAULT NULL ,
    create_time DATETIME      NOT NULL ,
    PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_shopping_cart_idx_user_id ON shopping_cart (user_id);

CREATE TABLE IF NOT EXISTS orders
(
    id                     BIGINT        NOT NULL AUTO_INCREMENT ,
    number                 VARCHAR(50)   DEFAULT NULL ,
    status                 INT           NOT NULL DEFAULT 1 ,
    user_id                BIGINT        NOT NULL ,
    address_book_id        BIGINT        NOT NULL ,
    order_time             DATETIME      NOT NULL ,
    checkout_time          DATETIME      DEFAULT NULL ,
    pay_method             INT           NOT NULL DEFAULT 1 ,
    pay_status             INT           NOT NULL DEFAULT 0 ,
    amount                 DECIMAL(10, 2) NOT NULL ,
    remark                 VARCHAR(100)  DEFAULT NULL ,
    phone                  VARCHAR(11)   DEFAULT NULL ,
    address                VARCHAR(255)  DEFAULT NULL ,
    user_name              VARCHAR(32)   DEFAULT NULL ,
    consignee              VARCHAR(32)   DEFAULT NULL ,
    cancel_reason          VARCHAR(255)  DEFAULT NULL ,
    rejection_reason       VARCHAR(255)  DEFAULT NULL ,
    cancel_time            DATETIME      DEFAULT NULL ,
    estimated_delivery_time DATETIME     DEFAULT NULL ,
    delivery_status        INT           NOT NULL DEFAULT 1 ,
    delivery_time          DATETIME      DEFAULT NULL ,
    pack_amount            INT           NOT NULL DEFAULT 0 ,
    tableware_number       INT           NOT NULL DEFAULT 0 ,
    tableware_status       INT           NOT NULL DEFAULT 1 ,
    PRIMARY KEY (id));

CREATE INDEX IF NOT EXISTS idx_orders_idx_user_id ON orders (user_id);

CREATE INDEX IF NOT EXISTS idx_orders_idx_number ON orders (number);

CREATE TABLE IF NOT EXISTS order_detail
(
    id          BIGINT        NOT NULL AUTO_INCREMENT ,
    name        VARCHAR(32)   NOT NULL ,
    order_id    BIGINT        NOT NULL ,
    dish_id     BIGINT        DEFAULT NULL ,
    setmeal_id  BIGINT        DEFAULT NULL ,
    dish_flavor VARCHAR(50)   DEFAULT NULL ,
    number      INT           NOT NULL DEFAULT 1 ,
    amount      DECIMAL(10, 2) NOT NULL ,
    image       VARCHAR(255)  DEFAULT NULL ,
    PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_order_detail_idx_order_id ON order_detail (order_id);
