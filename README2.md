## 1 electron 热更新插件

项目安装热更新插件
```
npm install nodemon --save-dev
```

修改启动脚本
```json
{
  "scripts": {
    "start": "electron ."
    "start": "nodemon --watch main.js --exec 'electron .'"
  }
}
```

