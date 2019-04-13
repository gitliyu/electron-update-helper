import {ipcRenderer} from 'electron';

export default class {

  constructor() {
    this.bindEvent();
  }

  /*
  * 检查更新
  * */
  checkForUpdates () {
    ipcRenderer.send('update-version');
  }

  /*
  * 绑定事件
  * */
  bindEvent () {
    this.showErrorMessage();
    this.bindMessageEvent();
    this.bindUpdatedEvent();
    this.bindProgressEvent();
  }

  /*
  * 监听更新过程主进程的通知
  * */
  bindMessageEvent () {
    ipcRenderer.on('message', (data, value) => {
      if (this.isFunction(this.messageHandle)) {
        try {
          this.messageHandle(value);
        } catch (e) {
          console.warn(e);
        }
      }
    });
  }

  /*
  * 监听更新完成事件
  * */
  bindUpdatedEvent () {
    ipcRenderer.on('isUpdateNow', () => {
      let promise = {};
      let updatedConfirm = new Promise(resolve => {
        promise.resolve = resolve;
      });
      updatedConfirm.then(() => {
        // 向主进程发送更新命令
        ipcRenderer.send('updateNow');
      });
      if (this.isFunction(this.updatedHandle)) {
        try {
          this.updatedHandle(promise.resolve);
        } catch (e) {
          console.warn(e);
        }
      } else {
        promise.resolve();
      }
    });
  }

  /*
  * 更新过程中的进度条事件
  * */
  bindProgressEvent () {
    ipcRenderer.on('downloadProgress', (event, progressObj) => {
      if (this.isFunction(this.progressHandle)) {
        try {
          this.progressHandle(progressObj);
        } catch (e) {
          console.warn(e);
        }
      }
    });
  }

  /*
  * 更新通知的处理函数
  * @param function fn
  * */
  setMessageHandle (fn) {
    this.messageHandle = fn;
  }

  /*
   * 更新完成后的回调
   * @param function fn
   * */
  setUpdatedHandle (fn) {
    this.updatedHandle = fn;
  }

  /*
   * 进度条处理函数
   * @param function fn
   * */
  setProgressHandle (fn) {
    this.progressHandle = fn;
  }

  /*
  * 判断是否为函数类型
  * @param function fn
  * return Boolean
  * */
  isFunction (fn) {
    return fn && typeof fn === 'function';
  }

  /*
  * 显示配置错误信息
  * */
  showErrorMessage () {
    ipcRenderer.on('config_error', (data, value) => {
      console.warn(value);
    });
  }
}