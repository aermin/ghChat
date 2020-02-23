![ghChat](https://user-images.githubusercontent.com/24861316/54087066-55783580-438a-11e9-9a5d-14288e84a3f9.png)


[![Node.js](https://img.shields.io/badge/Node.js-10.15.3-brightgreen.svg)](https://nodejs.org/en/download/)
[![MySQL](https://img.shields.io/badge/MySQL-5.7.22-lightgrey.svg)](https://www.mysql.com/downloads/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/aermin/ghChat/blob/master/LICENSE)
[![Author](https://img.shields.io/badge/Author-aermin-blue.svg)](https://github.com/aermin)

English | [简体中文](./README.md)

## ghChat(react version)

I hope that this project can be a chat tool for GitHub. So I will try to make it do some integration with GitHub. At present，it just support logging in with GitHub authorization and look GitHub user public information in ghChat. You can create group in ghChat for your github project and post the group link in the readme to convenient for the users' communication.

If you have anything idea about integration, welcome to create issues about feature suggestion, bug feedback or send pull requests.

### Address

[GitHub address](https://github.com/aermin/ghChat)

[Project online address(also this project's group address)，support logging in with GitHub authorization](https://im.aermin.top/group_chat/ddbffd80-3663-11e9-a580-d119b23ef62e)

Welcome to [ click this link](https://im.aermin.top/private_chat/1) to contact me.


### What technology do ghChat use?

Front-End : React+Redux+React-router+axios+scss；
Back-end: node(koa2)+mysql+JWT(Json web token);
use socket.io to send messages with each other.
And get other technology please follow the package.json file.

### Demo with photo：


![pic](https://user-images.githubusercontent.com/24861316/75103650-7cca2000-5638-11ea-8518-03eb95deb87b.png)

![pic1](https://user-images.githubusercontent.com/24861316/75103301-ff9cac00-5633-11ea-89b0-f54fa90b71ea.png)

![pic2](https://user-images.githubusercontent.com/24861316/75103299-fa3f6180-5633-11ea-9598-1f2852e5aa19.png)

![pic3](https://user-images.githubusercontent.com/24861316/57188951-5e285a80-6f3a-11e9-8def-ef932c4abc8b.png)

![pic4](https://user-images.githubusercontent.

### Suggest to open PWA: [How to turn on PWA in chrome?](https://github.com/aermin/blog/issues/63)

### Features && Progress

- Account system

  - [x] Log in
  - [x] Resister
  - [x] Log out
  - [x] log in multiple devices at the same time

- Integrate with github

  - [x] Log in with github authorization
  - [x] show github user public information

- UI
    - [x] Basic UI components: modal，notification ...
    - [x] Responsive layout.

- Private chat

  - [x] Chat with my contacts
  - [x] Add contact
  - [x] Contact information card
  - [x] Delete contact

- Group chat

  - [x] Chat together in a group
  - [x] Create a group
  - [x] Join a group
  - [x] Group information view, include group members, group notice, group name...
  - [x] Quit the group
  - [x] Editor group information
  - [x] Prompt when some one join group

- Search

  - [x] Search users and groups in local or online obscurely

- Rich chat mode

  - [x] Chat list sort by time every time
  - [x] Send photo
  - [x] Send emoji
  - [x] Send file
  - [x] Download file
  - [x] Press enter key to send message
  - [x] @somebody
  - [x] Full view photo
  - [x] Send photo from copy
  - [x] share user/group in the internal or external
  - [ ] Markdown
  - [ ] Quote

- Message notification

  - [x] Browser notification
  - [x] Browser notification switch
  - [x] Show chat messages unread number in the chat list
  - [x] chat messages unread number still show accurately when user refresh, reopen page or (different accounts)login again

- Performance

  - [x] Open gzip to compress static resource
  - [x] Lazy load chat messages. Fetch twenty messages by one time in every chat.
  - [x] lazy load components
  - [x] API request frequency limit
  - [x] Build file Split Chunks
  - [ ] SQL optimization

- Others

  - [x] Robot smart reply (just support Chinese)
  - [x] Add SSL for website
  - [x] PWA
  - [x] Rewrite back end code with TS
  - [ ] Multilingual solution with I18
  - [ ] encapsulate back end code as sdk.
  - [ ] CI/CD

### Development

1. clone project code
```
git clone https://github.com/aermin/ghChat.git
```

2. download npm module for front end

```
cd ghChat
```

```
npm i
```

3. download npm module for the back end
```
cd ghChat/server
```

```
npm i
```

4. init DB
```
// You should create a MySQL DB which name ghchat in local
DB configuration follows 'ghChat/server/src/configs/configs.dev.ts'

npm run init_sql // then check if it inits successfully
```
ps: if you want to use github authorization to log in and use qiniu cdn which provides storage to send photo and file, you should follow the file(ghChat/server/src/configs/configs.dev.ts) to configure. The default won't be able to use.


5. run front end and back end code
```
npm run start
```

```
cd ..
```

```
npm run start
```

### use in production

Premise: pls create secrets.ts file to do configuration inside ghChat/server/ folder

```
export default {
  port: '3000', // server port
  dbConnection: {
    host: '', // 数据库IP
    port: 3306, // 数据库端口
    database: 'ghchat', // 数据库名称
    user: '', // 数据库用户名
    password: '', // 数据库密码
  },
  client_secret: '', // client_secret of github authorization:  github-> settings ->  Developer settings to get
  jwt_secret: '', // secret of json web token
  qiniu: { // qiniu cdn configuration
    accessKey: '',
    secretKey: '',
    bucket: ''
  },
  robot_key: '', // the key of robot chat api => If you want to use robot chat, pls apply this key from http://www.tuling123.com/
};
```

1.build front end code

```
cd src
npm run build:prod
```

2.build server code

```
cd sever
npm run build:prod
```

3. put the folders(build, dist) which built from step1, step2 into you server, and run dist/index.js file
(here you can copy ghChat/server/package.json to your sever as well，and run command `npm run start:prod`)

### License

[MIT](https://opensource.org/licenses/MIT)

***Please indicate the source if you use the code of this project***

### Contributors

<a href="https://github.com/aermin"><img src="https://avatars2.githubusercontent.com/u/24861316?s=460&v=4" width="60" height="60" /></a>
<a href="https://github.com/AbbyJL"><img src="https://avatars2.githubusercontent.com/u/33203948?s=400&v=4" width="60" height="60" /></a>
<a href="https://github.com/ZouYouShun"><img src="https://avatars0.githubusercontent.com/u/5878538?s=400&v=4" width="60" height="60" /></a>
<a href="https://github.com/blackmatch"><img src="https://avatars1.githubusercontent.com/u/12443954?s=400&v=4" width="60" height="60" /></a>
<a href="https://github.com/gaoac"><img src="https://avatars3.githubusercontent.com/u/15978393?s=400&v=4" width="60" height="60" /></a>
