![ghChat](https://user-images.githubusercontent.com/24861316/54087066-55783580-438a-11e9-9a5d-14288e84a3f9.png)


English | [简体中文](./README-zh_CN.md)

## ghChat(react version)

I hope that this project can be a chat tool for GitHub. So I will try to make it do some integration with GitHub. At present，it just support logging in with GitHub authorization and look GitHub user public information in ghChat. You can create group in ghChat for your github project and post the group link in the readme to convenient for the users' communication.

If you have anything idea about integration, welcome to create issues about feature suggestion, bug feedback or send pull requests.

### Address

[GitHub address](https://github.com/aermin/react-chat)

[Project online address(also this project's group address)，support logging in with GitHub authorization](https://im.aermin.top/group_chat/ddbffd80-3663-11e9-a580-d119b23ef62e)

Welcome to [ click this link](https://im.aermin.top/private_chat/1) to contact me.


### What technology do ghChat use?

Front-End : React+Redux+React-router+axios+scss；
Back-end: node(koa2)+mysql+JWT(Json web token); 
use socket.io to send messages with each other. 
And get other technology please follow the package.json file.

### Demo with photo：

Just some functions

![image](https://user-images.githubusercontent.com/24861316/55677334-2f599d00-5918-11e9-8eb9-ab74a56572b1.png)

![image](https://user-images.githubusercontent.com/24861316/57189039-caf02480-6f3b-11e9-85b0-59f107b9b26f.png)

![image](https://user-images.githubusercontent.com/24861316/57188951-5e285a80-6f3a-11e9-8def-ef932c4abc8b.png)

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
  - [ ] Search expression online
  - [ ] Markdown
  - [ ] Quote

- Message notification

  - [x] Browser notification
  - [x] Show chat messages unread number in the chat list
  - [x] chat messages unread number still show accurately when user refresh, reopen page or (different accounts)login again

- Performance

  - [x] Open gzip to compress static resource
  - [x] Lazy load chat messages. Fetch twenty messages by one time in every chat.
  - [x] lazy load components
  - [x] API request frequency limit
  - [ ] css files build separately
  - [ ] SQL optimization

- Others

  - [x] Robot smart reply (just support Chinese)
  - [x] Add SSL for website
  - [x] PWA
  - [ ] Multilingual solution with I18
  - [ ] Rewrite back end code with TS，encapsulated as sdk.
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

### License

[MIT](https://opensource.org/licenses/MIT)

***Please indicate the source if you use the code of this project***
