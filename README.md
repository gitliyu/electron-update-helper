# electron-update-helper

依赖`electron-builder`和`electron-updater`的`electron`版本更新方法，基于原有方法进行了封装，易于使用

### 安装
使用npm
```
npm install electron-update-helper
```

### 使用
主进程，在创建`BrowserWindow`后使用`MainHelper`，初始化实例即可，详见['demo'](https://github.com/gitliyu/electron-update-helper/blob/master/demo/main.js)
```javascript
import {MainHelper} from 'electron-update-helper'

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    height: 768,
    width: 1024
  });

  // 接受两个参数
  // 1 创建的BrowserWindow对象
  // 2 版本更新地址，需要和package.json中electron-builder的publish url配置相同
  new MainHelper(mainWindow, URL);
});
```
渲染进程中，使用`RenderHelper`
```
import {RenderHelper} from 'electron-update-helper'

let renderHelper = new RenderHelper();
```
渲染进程事件，详见['demo'](https://github.com/gitliyu/electron-update-helper/blob/master/demo/render.html)
- `checkForUpdates`: 触发版本更新
```javascript
renderHelper.checkForUpdates();
```
- `setMessageHandle`: 更新通知的处理函数，参数为以下四种提示
```javascript
renderHelper.setMessageHandle(message => {
  switch (message) {
    case 'error':
      alert('更新异常');
      break;
    case 'checking':
      alert('开始检查更新');
      break;
    case 'update':
      alert('正在下载更新中');
      break;
    case 'new':
      alert('当前是最新版本，无需更新');
      break;
  }
});
```
- `setProgressHandle`： 进度条处理函数，参数为进度条对象
```javascript
renderHelper.setProgressHandle(progressObj => {
  console.log(`当前更新进度为${progressObj.percent}`);
});
```
- `setUpdatedHandle`: 更新完成后的回调，参数为一个事件，当done方法被调用时，会退出并执行更新
```javascript
renderHelper.setUpdatedHandle(done => {
  if (confirm('已下载完成,现在退出并更新吗？')) {
    done();
  }
});
```

### 注意事项
在使用`electron-updater`进行版本更新时，需要在`package.json`中添加一下配置，注意`url`地址应当与`MainHelper`传入的一致
```javascript
{
  "build": {
    "productName": "Name",
    "appId": "org.simulatedgreg.electron-vue",
    "publish": [
      {
        "provider": "generic",
        "url": "your url"
      }
    ],
    "directories": {
      "output": "build"
    }
  }
}
```

### 依赖
- ['Electron-builder'](https://www.npmjs.com/package/electron-builder)
- ['electron-updater'](https://www.npmjs.com/package/electron-updater)