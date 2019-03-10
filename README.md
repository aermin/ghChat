![ghChat](https://user-images.githubusercontent.com/24861316/54087066-55783580-438a-11e9-9a5d-14288e84a3f9.png)


English | [简体中文](./README-zh_CN.md)

## ghChat(react version)

I hope that this project can be a chat tool for GitHub. So I will try to make it do some integration with GitHub. At present，it just support logging in with GitHub authorization and look GitHub user public information in ghChat. If you have anything idea about integration, welcome to create issues about feature suggestion, bug feedback or send pull requests.

### Address

[GitHub address](https://github.com/aermin/react-chat)

[Project online address，support log in with GitHub authorization](https://im.aermin.top)

Welcome to join this project's group which named 'ghChat'. You click the inviting button from the robot. And you can search to join it as well.

![image](https://user-images.githubusercontent.com/24861316/53296199-6337a200-3845-11e9-8435-3f5480cca602.png)


### What technology do ghChat use?

Front-End : React+Redux+React-router+axios+scss；
Back-end: node(koa2)+mysql+JWT(Json web token); 
use socket.io to send messages with each other. 
And get other technology please follow the package.json file.

### Features && Progress

- Account system

  - [x] Log in
  - [x] Resister
  - [x] Log in with github authorization
  - [x] Log out

- UI
    - [x] Basic UI components: modal，nitification ...
    - [x] Responsive layout.

- Private chat

  - [x] Chat with my contacts
  - [x] Add contact
  - [x] Contact infomation card
  - [ ] Delete contact

- Group chat

  - [x] Chat together in a group
  - [x] Create a group
  - [x] Join a group
  - [x] Group information view, include group members, group notice, group name...
  - [x] Quit the group
  - [ ] Editor group information

- Search

  - [x] Search users and groups in local or online obscurely

- Rich chat mode

  - [x] Chat list sort by time everytime
  - [x] Send photo
  - [x] Send emoji
  - [x] Send file
  - [x] Download file
  - [x] Press enter key to send message
  - [x] @somebody
  - [x] View photo
  - [ ] Search expression online
  - [ ] Markdown
  - [ ] Quote

- Message notification

  - [x] Browser notification
  - [x] Show chat messages unread number in the chat list

- Performance

  - [x] Open gzip to compress static resource
  - [x] Lazy load chat messages. Fetch twenty messages by one time in every chat.
  - [ ] SQL optimization

- Others

  - [x] Robot smart reply (just support Chinese)
  - [x] Add SSL for website
  - [ ] PWA
  - [ ] Back end rewrite with TS，encapsulated as sdk.
  - [ ] CI/CD

### Development

1. clone project code
```
git clone https://github.com/aermin/react-chat.git
```


2.  create an empty file which names 'secret.js' in the root directory of this project.

But if you want to log in with GitHub authorization, use third part cdn to send files in chat, or separate configuration for DB, jwt secret, you should add content as follows in secret.js. So without this authorization, you just can't use features about send files and log in with GitHub.

```
module.exports = {
  client_secret: '', // client_secret of github authorization:  github-> settings ->  Developer settings to get 
  db: {
    host: '', 
    port: ,
    database: '',
    user: '',
    password: '',
  },
  secretValue: '', // secret of json web token
  qiniu: { // qiniu cdn configuration
    accessKey: '',
    secretKey: '',
    bucket: ''
  }
};
```

3. download npm module for front end

```
cd react-chat
```

```
npm i
```

4. download npm module for back end
```
cd cd react-chat/server 
```

```
npm i
```

5. init DB
```
// You should create a MySQL DB which name ghcaht in local
DB configuration follows 'react-chat/server/config.js'

npm run init_sql
```

6. run front end and back end code
```
npm run start
```

```
cd ..  
```

```
npm run start
```

### Demo with photo：

![image](https://user-images.githubusercontent.com/24861316/53351929-e1d33300-395c-11e9-84a9-0a9fd793b5a1.png)

![image](https://user-images.githubusercontent.com/24861316/53295822-b3f7cc80-383e-11e9-83b4-82a12bd4a24f.png)

![image](https://user-images.githubusercontent.com/24861316/53296063-eb687800-3842-11e9-9da3-ab1c312c673d.png)

![image](https://user-images.githubusercontent.com/24861316/53296160-afcead80-3844-11e9-9827-4b03303fcd3d.png)

![image](https://user-images.githubusercontent.com/24861316/53351432-4346d200-395c-11e9-936e-e08d887f1355.png)
