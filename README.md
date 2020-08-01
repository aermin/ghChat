
>### GitAds
><a href="https://tracking.gitads.io/?repo=ghChat"><img src="https://images.gitads.io/ghChat" alt="GitAds"/></a>

![ghChat](https://user-images.githubusercontent.com/24861316/54087066-55783580-438a-11e9-9a5d-14288e84a3f9.png)

[![Node.js](https://img.shields.io/badge/Node.js-10.15.3-brightgreen.svg)](https://nodejs.org/en/download/)
[![MySQL](https://img.shields.io/badge/MySQL-5.7.22-lightgrey.svg)](https://www.mysql.com/downloads/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/aermin/ghChat/blob/master/LICENSE)
[![Author](https://img.shields.io/badge/Author-aermin-blue.svg)](https://github.com/aermin)

[English](./README-en.md) | 简体中文

## ghChat(react版)

之所以叫ghChat，是想着以后做一些GitHub的集成，希望让这个即时通讯工具成为chat tool for github。目前只支持github授权登录，和展示github用户公开的信息，然后可以方便地在ghChat中为自己的github项目建个项目群，然后贴群链接到readme中，方便项目即时交流。

[应用线上地址(也是项目的群链接)，支持直接github授权登录](https://im.aermin.top/group_chat/ddbffd80-3663-11e9-a580-d119b23ef62e)

***倘若github登录失败***

<details><summary><b>查看如何设置</b></summary><br>

很可能是你的github没有设置public的email

![ACF5CEB66E47AEE81B5ABD21592A3827](https://user-images.githubusercontent.com/24861316/75132311-76f43d80-5711-11ea-8f9d-8d609b754516.jpg)
</details>


> [建议开启PWA](https://github.com/aermin/blog/issues/63)

### 技术栈

前端React全家桶，PWA，后端node.js(koa2)，后端支持并写了点TS(大多类型还没补 T^T)
, 数据库MySQL, SocKetIO, JWT等等，具体看package.json。另外生产环境用了Nginx, SSL, Pm2等。欢迎加ghChat群交流哦，我每天都在线，也可以[点击私聊我](https://im.aermin.top/private_chat/1)

![pic](https://user-images.githubusercontent.com/24861316/75103650-7cca2000-5638-11ea-8518-03eb95deb87b.png)


### 详细的项目展示图

<details><summary><b>点开查看</b></summary><br>

![pic1](https://user-images.githubusercontent.com/24861316/75103301-ff9cac00-5633-11ea-89b0-f54fa90b71ea.png)

![pic2](https://user-images.githubusercontent.com/24861316/75103299-fa3f6180-5633-11ea-9598-1f2852e5aa19.png)

![pic3](https://user-images.githubusercontent.com/24861316/57188951-5e285a80-6f3a-11e9-8def-ef932c4abc8b.png)

![pic4](https://user-images.githubusercontent.com/24861316/75103530-979b9500-5636-11ea-9334-bac68924005b.png)
</details>

### 目前进度

<details><summary>点开查看</summary><br>

- 账户

登录/ 注册/ 退出登录/ 多设备同时登录

- 对github的集成

支持github授权登录/ 展示github用户公开的信息

- UI

响应式布局, 适配桌面端和移动端/ 大部分UI组件自己写

- 私聊

私聊/ 添加联系人/好友资料展示/ 删除联系人

- 群聊

群聊/ 建群/ 加群/ 群资料展示/ 退群/ 编辑群资料/ 新人进群通知

- 查询

用户搜索&&群搜索： 支持前端模糊搜索和后端模糊搜索

- 丰富聊天方式

发图/ 发表情/ 发文件/ 下载文件/ Enter快捷键发送信息/ @某人/ 图片查看/
发送copy的图片(如截图后粘贴可直接发图)/ 根据时间降序展示聊天页表/
分享群|联系人给其他的人|群（应用内|外都支持）

- 新消息提示

浏览器桌面通知/ 消息是否提示的开关设置/ 列表未读消息数目提示/
刷新|重开|(不同账号)重登页面，列表未读消息的数目将仍然且准确显示

- 不断的重构和优化

gzip 压缩/ 分包build文件/ 聊天内容懒加载/
路由按需加载/ 接口请求频率限制/ WebSocket管理机制


- 其他

机器人智能聊天回复/ 部署SSL证书/ 支持PWA/ 后端支持TS

- TODO

支持Markdown/ 支持引用聊天内容/ 后端封装成sdk/ 国际化/ CI CD

</details>

### 项目结构图

<details><summary>点开查看</summary><br>

```
├── LICENSE
├── README-zh_CN.md
├── README.md
├── package-lock.json
├── package.json
├── postcss.config.js
├── server // 后端代码
│   ├── ecosystem.config.js
│   ├── init // 初始化mysql数据库的脚本
│   ├── nodemon.json
│   ├── package-lock.json
│   ├── package.json
│   ├── secrets.ts // 放一些非公开的secret
│   ├── src
│     ├── app
│     ├── context
|     ├── controllers
|     ├── index.ts
|     ├── middlewares
|     ├── routes // 后端路由，跟登录注册模块有关
|     ├── server.ts
|     ├── services
|     ├── socket // 除了登录注册，其他都用socket 来通信
|     └── utils
|     ├── configs
|       ├── configs.common.ts // 后端通用配置
|       ├── configs.dev.ts // 后端开发配置
|       └── configs.prod.ts // 后端生产配置
    └── main.ts
│   ├── tsconfig.json
│   ├── tslint.json
│   └── webpack.config.js
├── src // 前端代码
│   ├── App.js
│   ├── app.scss
│   ├── assets
│   ├── components
│   ├── containers
│   ├── index.html
│   ├── index.js
│   ├── manifest.json // PWA需要
│   ├── modules
│   ├── redux
│   ├── router
│   ├── service-worker.js // PWA需要
│   └── utils
├── webpack.common.config.js  // 通用webpack设置
├── webpack.prod.config.js //生产相关的webpack配置
└── webpack.dev.config.js //开发相关的webpack配置
```
</details>

### 本地开发

<details><summary>点开查看</summary><br>

1. 项目拉到本地
```
git clone https://github.com/aermin/ghChat.git
```

2. 下载前端的npm包
```
cd ghChat
```

```
npm i
```

3. 下载后端的npm包
```
cd ghChat/server
```

```
npm i
```

4. 初始化数据库

```
//需要先在本地建一个名为ghchat的mysql数据库
数据库配置参考如下(ghChat/server/src/configs/configs.dev.ts) 的dbConnection

npm run init_sql    //然后查看下数据库是否init成功
```

ps: 如果要使用github授权登录，发图片和发文件(使用七牛云cdn)，就要在文件(ghChat/server/src/configs/configs.dev.ts)填充相应的配置了，否则默认无法使用


5. 跑起前端和后端的代码
```
npm run start
```

```
cd ..      // 返回到ghChat/目录
```

```
npm run start
```

</details>


### 生产环境使用

<details><summary>点开查看</summary><br>

前提：在ghChat/server/ 文件夹下创建secrets.ts文件
```
export default {
  port: '3000', // server 端口
  dbConnection: {
    host: '', // 数据库IP
    port: 3306, // 数据库端口
    database: 'ghchat', // 数据库名称
    user: '', // 数据库用户名
    password: '', // 数据库密码
  },
  client_secret: '', // github的client_secret
  jwt_secret: '', // jwt的secret
  qiniu: { // 七牛云cdn配置
    accessKey: '',
    secretKey: '',
    bucket: ''
  },
  robot_key: '', // 机器人聊天用到的key => 请自己申请 http://www.tuling123.com/
};
```

1.build前端代码

```
cd src
npm run build:prod
```

2.build后端代码

```
cd sever
npm run build:prod
```
3. 把步骤1，2产生的文件夹(build, dist)放到你的服务器上, 把dist/index.js文件跑起来
(可以把ghChat/server/package.json 一并拷到到你的服务器上，然后执行`npm run start:prod`)

</details>


这边开坑了一篇[ghChat开发历程](https://github.com/aermin/blog/issues/60) ，将不断地更新总结做这个全栈项目时会遇到的问题，知识点，和坑。


### License

[MIT](https://opensource.org/licenses/MIT)

> 码代码不易，引用借鉴请注明出处

### Contributors

<details><summary>感谢大佬们的pr</summary><br>


<a href="https://github.com/aermin"><img src="https://avatars2.githubusercontent.com/u/24861316?s=460&v=4" width="60" height="60" /></a>
<a href="https://github.com/AbbyJL"><img src="https://avatars2.githubusercontent.com/u/33203948?s=400&v=4" width="60" height="60" /></a>
<a href="https://github.com/ZouYouShun"><img src="https://avatars0.githubusercontent.com/u/5878538?s=400&v=4" width="60" height="60" /></a>
<a href="https://github.com/blackmatch"><img src="https://avatars1.githubusercontent.com/u/12443954?s=400&v=4" width="60" height="60" /></a>
<a href="https://github.com/gaoac"><img src="https://avatars3.githubusercontent.com/u/15978393?s=400&v=4" width="60" height="60" /></a>

</details>


### 最后

对你有帮助或者觉得还不错可以star或者打赏下(〃'▽'〃)

<details><summary>打赏二维吗</summary><br>

![donate](https://cdn.aermin.top/WechatIMG20.png)

</details>
