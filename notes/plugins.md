## clean-webpack-plugin

### 基本

1. 用于清除打包产物，默认清除的是 output 的产出

### 使用

```javascript
new CleanWebPack("文件名", {
  root: "", // 定义文件目录，新版本已废弃；情景：打包产物置于项目顶层，需配置
});
```
