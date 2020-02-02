import { ChatService, GroupChatService, GroupService, UserService } from './../services';

export class ServicesContext {
  static instance: ServicesContext;

  static getInstance(): ServicesContext {
    if (!ServicesContext.instance) {
      ServicesContext.instance = new ServicesContext();
    }
    return ServicesContext.instance;
  }

  // user
  private _userService: UserService;
  public get userService() {
    return this._userService;
  }
  public setuserService(service: UserService): ServicesContext {
    this._userService = service;
    return this;
  }

  // group
  private _groupService: GroupService;
  public get groupService() {
    return this._groupService;
  }
  public setGroupService(service: GroupService): ServicesContext {
    this._groupService = service;
    return this;
  }

  // chat
  private _chatService: ChatService;
  public get chatService() {
    return this._chatService;
  }
  public setChatService(service: ChatService): ServicesContext {
    this._chatService = service;
    return this;
  }

  // groupChat
  private _groupChatService: GroupChatService;
  public get groupChatService() {
    return this._groupChatService;
  }
  public setgroupChatService(service: GroupChatService): ServicesContext {
    this._groupChatService = service;
    return this;
  }
}
