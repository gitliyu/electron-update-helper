import {ipcMain} from 'electron';
import {autoUpdater} from 'electron-updater';

export default class {

  constructor(mainWindow, url) {
    if (!ipcMain) {
      this.sendErrorMessage('未安装electron');
    }

    this.mainWindow = mainWindow;
    this.setFeedURL(url);
    this.updateHandle();
  }

  /*
   * 设置更新地址
   * @param string url 
   * */
  setFeedURL(url) {
    if (!url) {
      return this.sendErrorMessage('请配置版本更新地址');
    }
    try {
      autoUpdater.setFeedURL(url);
    } catch (e) {
      this.sendErrorMessage('未安装electron-updater');
    }
  }

  /*
   * 配置更新方法
   * */
  updateHandle() {
    if (this.verifyFaild) {
      return false;
    }
    // 更新失败
    autoUpdater.on('error', (ev, err) => {
      this.sendMessage('message', 'error');
      this.sendErrorMessage('Error in auto-updater.' + err + '|' + ev)
    });
    // 开始检查更新
    autoUpdater.on('checking-for-update', () => {
      this.sendMessage('message', 'checking')
    });
    // 正在更新中
    autoUpdater.on('update-available', () => {
      this.sendMessage('message', 'update')
    });
    // 当前版本是最新
    autoUpdater.on('update-not-available', () => {
      this.sendMessage('message', 'new')
    });
    // 下载进度条
    autoUpdater.on('download-progress', progressObj => {
      this.sendMessage('downloadProgress', progressObj);
    });
    // 更新完成后通知渲染进程
    autoUpdater.on('update-downloaded', () => {
      // 监听渲染进程事件，退出并重新安装
      ipcMain.on('updateNow', () => {
        autoUpdater.quitAndInstall();
      });
      this.sendMessage('isUpdateNow')
    });

    // 检查更新
    ipcMain.on('update-version', () => {
      autoUpdater.checkForUpdates();
    })
  }

  /*
   * 向渲染进程发送事件
   * @param string name
   * $param string value
   * */
  sendMessage(name, value) {
    this.mainWindow.webContents.send(name, value);
  }

  /*
   * 验证失败，配置项存在错误
   * @param string type
   * */
  sendErrorMessage(message) {
    this.verifyFaild = true;
    this.sendMessage('config_error', message);
  }
}
