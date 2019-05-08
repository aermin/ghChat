import notification from '../../components/Notification';

export default class BrowserNotification {
  constructor() {
    this._notificationEnable = false;
    this._checkOrRequirePermission();
  }

  _checkOrRequirePermission() {
    if (!this.notification) {
      // eslint-disable-next-line no-alert
      notification('此浏览器不支持浏览器提示', 'warn', 3);
      return;
    }
    if (this.hasPermission) {
      this._notificationEnable = true;
      return;
    }
    if (this.permission && this.permission !== 'denied') {
      this.notification.requestPermission((status) => {
        if (this.permission !== status) {
          this.permission = status;
        }
        if (status === 'granted') {
          this._notificationEnable = true;
        }
      });
    }
  }

  notify({
    title, text, icon, onClick
  }) {
    if (!this._notificationEnable) {
      return;
    }
    const n = new window.Notification(title, { body: text, icon });
    n.onclick = () => {
      onClick();
      n.close();
    };
    this._onPlay(audio);
  }

  _onPlay(src) {
    let div = document.getElementById("playercnt");
    if(div==null)
    {
        div=document.createElement("div");
        div.id="playercnt";
        div.setAttribute("style","display:none");
        document.body.appendChild(div);
    }
    if(document.createElement('audio').play == null)
    {
        //ie
        div.innerHTML = `<EMBED id='player' src='${src}' hidden='true'  loop='false' autostart='true'>`;
    }else
    {
      div.innerHTML = `<audio id='player' src='${src}' hidden autoplay></audio>`;
    }
}

  get permission() {
    return this.notification.permission;
  }

  set permission(value) {
    if (value) {
      this.notification.permission = value;
    }
  }

  get hasPermission() {
    return this.permission && (this.permission === 'granted');
  }

  get notification() {
    return window.Notification;
  }
}
