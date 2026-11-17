# 苍穹外卖 · Sky Take Out

一套完整的餐饮外卖系统（管理端 + 微信小程序用户端），实现 17 个业务 Controller 的全部接口：员工与权限、分类、菜品、套餐、店铺营业状态、购物车、订单流转、地址簿、工作台与统计报表。

## 项目结构

| 模块 | 说明 |
| --- | --- |
| `sky-common` | 公共模块：常量、上下文 `BaseContext`、异常、JWT、阿里云 OSS 工具、统一返回 `Result` |
| `sky-pojo` | 实体层：Entity / DTO / VO |
| `sky-server` | 服务端：17 个 Controller、Service、MyBatis Mapper（XML）、拦截器、全局异常处理 |
| `sky-miniprogram` | 微信小程序端：点餐、购物车、下单、订单、地址管理 |
| `db/sky_take_out.sql` | MySQL 初始化脚本 |
| `upload/` | 图片上传目录 |

## 接口覆盖

| 端 | Controller |
| --- | --- |
| 管理端 `/admin` | Employee、Category、Dish、Setmeal、Shop、Order、Report、Workspace、Common（上传） |
| 用户端 `/user` | User（微信登录）、Category、Dish、Setmeal、Shop、ShoppingCart、Order、AddressBook |

## 技术栈

| 层次 | 技术 |
| --- | --- |
| 语言/框架 | Java 17、Spring Boot 3.5.16、Spring MVC、MyBatis 3.0.5 |
| 数据 | MySQL 8、Druid 连接池、`map-underscore-to-camel-case`、11 个 Mapper XML |
| 认证 | JJWT 0.12.6，管理端与用户端双拦截器各自签发/校验 token |
| 文档 | Knife4j 4.5.0（OpenAPI 3 / springdoc） |
| 三方 | 阿里云 OSS 3.10.2、微信支付工具 `WeChatPayUtil`、Apache POI 3.16 |
| 前端 | 微信小程序原生框架（`pages` / `components` / `utils`） |

## 快速开始

1. 导入数据库：`mysql -u root -p < db/sky_take_out.sql`
2. 按本机环境修改 `sky-server/src/main/resources/application-dev.yml`（数据库地址、账号、口令）
3. 构建：`mvn clean package`
4. 启动 `SkyApplication`，默认端口 `8080`；接口文档 `http://localhost:8080/doc.html`
5. 小程序端：微信开发者工具导入 `sky-miniprogram/`，在 `config/` 中改服务地址

## 配置说明

仓库内 `application.yml` / `application-dev.yml` 只包含**本地开发默认值**（数据库口令 `123456`、开发用 JWT 密钥）。部署到任何非本机环境前，请替换为自己的口令与随机密钥，并改用环境变量或外部配置注入。

---

MIT License · Author: [lici-cao](https://github.com/lici-cao)

## 桌面版（免安装，双击即用）

支持在 **无 JDK、无 MySQL** 的 Windows 机器上直接运行：由 GitHub Actions 云端构建，将 Spring Boot 主程序、
裁剪后的 Java 17 运行时与内嵌 H2 文件数据库（MySQL 兼容模式）打包为免安装 zip。

- 下载：前往 Releases 获取 `SkyTakeOut-desktop-win64.zip`
- 使用：解压后双击 `start.bat`（带控制台）或 `start-silent.vbs`（静默启动），浏览器自动打开 http://localhost:8080
- 账号：管理端 `admin` / `123456`；接口文档 http://localhost:8080/doc.html
- 数据：`data\sky_take_out.mv.db`，删除 `data` 目录后重启即恢复初始演示数据
- 构建：`.github/workflows/desktop-build.yml`（Maven 打包 → jlink 运行时 → 冒烟测试 → 打 zip → 发布 Release）

桌面版与 MySQL 版共用同一套代码：默认 `dev` profile 走 MySQL，桌面版通过 `-Dspring.profiles.active=desktop` 切换内嵌 H2。
