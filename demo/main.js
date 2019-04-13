// 主进程
import {app, BrowserWindow} from 'electron';
import {MainHelper} from 'electron-update-helper'

const URL = 'http://xxx.com';
let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    height: 768,
    width: 1024
  });

  mainWindow.loadURL(winURL);

  // 接受两个参数
  // 1 创建的BrowserWindow对象
  // 2 版本更新地址，需要和package.json中electron-builder的publish url配置相同
  new MainHelper(mainWindow, URL);
});