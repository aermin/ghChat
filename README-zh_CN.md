![ghChat](https://user-images.githubusercontent.com/24861316/54087066-55783580-438a-11e9-9a5d-14288e84a3f9.png)


[English](./README.md) | 简体中文

## ghChat(react版)

之所以叫ghChat，是想着以后做一些GitHub的集成，希望让这个即时通讯工具成为chat tool for github。

目前只支持github授权登录，和展示github用户公开的信息。

### 地址

[github项目地址](https://github.com/aermin/react-chat)。***富应用型的开发很耗时间精力，觉得还不错的麻烦给个star以兹鼓励下*** 


[网站线上地址，支持直接github授权登录](https://im.aermin.top)。

欢迎加入 "ghChat" 这个群交流呀，可[点击链接加入](https://im.aermin.top/group_chat/ddbffd80-3663-11e9-a580-d119b23ef62e?name=ghChat)，可搜索群名(不用全打)加入，也可点击机器人的邀请加入

### 技术栈

前端React全家桶，后端node.js(koa2), 数据库MySQL, 双向通信SocKet.io, jwt鉴权等等。具体看package.json。有疑问的可以加ghChat群交流哦，我每天都在线，也可以私聊我，[点击加我](https://im.aermin.top/private_chat/1?name=aermin)

### 项目展示：

之前某个时间的大部分功能的截图，其他功能和新功能直接[线上体验](https://im.aermin.top)。

![image](https://user-images.githubusercontent.com/24861316/55677334-2f599d00-5918-11e9-8eb9-ab74a56572b1.png)

![image](https://user-images.githubusercontent.com/24861316/55677498-4221a100-591b-11e9-9e76-31c490d87c8a.png)

Tips: [如何在chrome浏览器中开启对PWA的支持](https://github.com/aermin/blog/issues/63)

### 目前进度

- 账户

  - [x] 登录
  - [x] 注册
  - [x] 退出登录
  - [x] 多设备同时登录

- 对github的集成

  - [x] 支持github授权登录 
  - [x] 展示github用户公开的信息

- UI
    - [x] 弹窗，提示等基础组件
    - [x] 响应式布局, 适配桌面端和移动端。

- 私聊

  - [x] 私聊（外加重要的重构）：始化时请求聊天列表所有聊天对象的聊天记录（~~后期限制为每个聊天项只初始化20条最新聊天内容~~已实现，避免初始化数据量过大，时间过长），接着根据点击列表导致chatId(取自url params)的改变，重新渲染新的聊天内容。以前vue-chat的实现方式是点击进入每个聊天页面都会发1至多次请求然后渲染页面，性能较差
  - [x] 添加联系人: 搜索到该用户并发送信息后即记录为好友(关系存DB)，会展示在双方的聊天列表
  - [x] 好友资料展示
  - [ ] 删除联系人

- 群聊

  - [x] 群聊 && 重构： 本来是根据消息列表上的群和好友去遍历发HTTP请求拿数据，现在直接在后端整合好一次性用websocket发过来，减少请求次数且websocket在此情况性能更优一些； 完成群聊功能
  - [x] 建群
  - [x] 加群：搜索到该群并点击，会看到当前时间前的聊天记录，点加入按钮后即成功加入群(关系存DB)，开始受到群消息的广播，并且群会展示在聊天列表
  - [x] 群资料展示
  - [x] 退群：退群后聊天列表不再展示该群(DB中删除该关系)
  - [x] 编辑群资料

- 查询

  - [x] 用户搜索&&群搜索： 支持前端模糊搜索和后端模糊搜索

- 丰富聊天方式

  - [x] 聊天页表： 实时按时间降序展示联系过的人和加入的群
  - [x] 发图
  - [x] 发表情
  - [x] 发文件
  - [x] 下载文件
  - [x] Enter快捷键发送信息,发送按钮灰亮
  - [x] @某人
  - [x] 图片放大查看
  - [x] 发送copy的图片(如qq截图后粘贴可直接发图)
  - [x] 分享群|联系人给其他的人|群（应用内|外都支持）
  - [ ] 提供在线表情库
  - [ ] 支持Markdown
  - [ ] 支持Quote

- 新消息提示

  - [x] 浏览器桌面通知（生产环境下，使用chrome的桌面通知需要你的网站是HTTPS的）
  - [x] 列表未读消息数目提示
  - [x] 刷新/重开/(不同账号)重登页面，列表未读消息的数目将仍然且准确显示

- 不断的重构和性能优化

  - [x] gzip 压缩
  - [x] 聊天内容懒加载，每次获取20条数据
  - [x] 路由按需加载
  - [ ] css文件单独打包  
  - [ ] sql优化

- 其他

  - [x] 机器人智能聊天回复
  - [x] 部署SSL证书
  - [x] 支持PWA
  - [ ] 国际化
  - [ ] 后端用TS重写，封装成sdk
  - [ ] CI/CD

### 项目结构图

```
├── LICENSE
├── README-zh_CN.md
├── README.md
├── build
├── package-lock.json
├── package.json
├── postcss.config.js
├── secret.js // 放一些非公开的secret
├── server  // 后端代码
│   ├── config.js
│   ├── controllers
│   ├── ecosystem.config.js // pm2加生产环境变量的配置文件
│   ├── gulpfile.js
│   ├── index.js
│   ├── init  // 初始化mysql
│   ├── middlewares
│   ├── models
│   ├── package-lock.json
│   ├── package.json
│   ├── routes  // 后端路由，跟登录注册模块有关
│   ├── socket  // 除了登录注册，其他都用socket 来通信
│   ├── utils
│   └── yarn.lock
├── src  // 前端代码
│   ├── App.js
│   ├── app.scss
│   ├── assets
│   ├── components
│   ├── containers
│   ├── index.html
│   ├── index.js
│   ├── manifest.json // PWA需要
│   ├── modules
│   ├── redux
│   ├── router
│   ├── service-worker.js // PWA需要
│   └── utils
├── webpack.common.config.js  // 通用webpack设置
├── webpack.config.js  //生产相关的webpack配置
├── webpack.dev.config.js  //开发相关的webpack配置
```

### 本地开发

1. 项目拉到本地
```
git clone https://github.com/aermin/react-chat.git
```


2. 在react-chat文件夹下创建一个secret.js的空白文件。

如果要使用github授权登录，使用七牛云cdn，生产环境数据库和jwt的secret的单独配置，就要填充相应的配置了。
```
module.exports = {
  client_secret: '', // github授权登录需要的  github-> settings ->  Developer settings 那边生成获取
  db: {
    host: '', // 数据库IP
    port: , // 数据库端口
    database: '', // 数据库名称
    user: '', // 数据库用户名
    password: '', // 数据库密码
  },
  secretValue: '', // json web token 的 secret
  qiniu: { // 七牛云配置
    accessKey: '',
    secretKey: '',
    bucket: ''
  }
};
```

3. 下载前端的npm包
```
cd react-chat
```

```
npm i
```

4. 下载后端的npm包
```
cd cd react-chat/server 
```

```
npm i
```

5. 初始化数据库
```
//需要先在本地建一个名为ghchat的mysql数据库
配置如下看react-chat/server/config.js

npm run init_sql    //然后查看下数据库是否init成功
```

6. 跑起前端和后端的代码
```
npm run start
```

```
cd ..      // 返回到react-chat/目录
```

```
npm run start
```

ps: 本地发图片和发文件和github登录无法使用，需要自己去github和七牛云申请一些东西

### 文档

这边开坑了一篇[ghChat开发历程](https://github.com/aermin/blog/issues/60) ，将不断地更新总结做这个全栈项目时会遇到的问题，知识点，和坑。


### License

[MIT](https://opensource.org/licenses/MIT)

***码代码不易，引用借鉴请注明出处***