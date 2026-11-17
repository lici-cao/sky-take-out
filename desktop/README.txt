苍穹外卖 · 桌面版（免安装）
========================================

一、启动
  1. 双击 start.bat        —— 带控制台窗口，可看到启动日志（推荐首次使用）
  2. 双击 start-silent.vbs —— 无窗口静默启动，13 秒后自动打开浏览器
  启动完成后浏览器会打开 http://localhost:8080 ，即本系统的桌面控制台。

二、登录信息
  管理端账号：admin / 123456
  接口文档：http://localhost:8080/doc.html

三、目录说明
  app\      程序主体（sky-take-out.jar）
  runtime\  内置 Java 17 运行时（无需自行安装 JDK）
  upload\   上传的图片存放目录
  data\     H2 数据库文件（sky_take_out.mv.db），删除该目录即可重置为初始演示数据
  logs\     运行日志

四、常见问题
  1. 端口被占用：设置环境变量 SKY_PORT 后再启动，例如 set SKY_PORT=8081
  2. 启动窗口一闪而过：确认杀毒软件未拦截 runtime\bin\java.exe
  3. 浏览器显示无法访问：等待 15 秒后刷新；仍失败请查看 logs\sky-take-out.log
  4. 微信登录/微信支付相关接口会失败：桌面离线环境无微信商户配置，属正常现象

五、技术栈
  Spring Boot 3.5.16 · Java 17 · MyBatis · H2（MySQL 兼容模式） · Knife4j 4.5.0
