## Tree Shaking

### 基本

1. Tree Shaking 用于剔除 dead code
2. 由于不能动态解析，所以依赖静态的 ESM （模块依赖关系高度确定）
3. 副作用（在导入时会执行特殊行为的代码）：由于 Terser 在执行 Tree Shaking 时，判断存在副作用的代码是否对项目”有害“是非常麻烦的，所以选择将副作用保留，手动注释副作用无害：
   - /_#**PURE**_/：语句层面
   - sideEffects：默认 true，模块层面
   ```javascript
   // package.json
   {
   "name": "your-project",
   "sideEffects": ["./src/some-side-effectful-file.js"] // 数组内的模块有副作用
    "sideEffects": false // 项目模块均无副作用
   }
   ```

### 使用

1. 配置 babel 保留 es6 模块化语句
2. 模式：
   - 开发模式
   1. optimization.usedExports：启用标记功能，标记为 unused 的导出语句会被删除（但没有删除导入语句）
   2. 启用代码压缩工具（erser 插件，删除所有引用被标记内容的代码语句） mode = production；optimization.minimize = true；
      optimization.minimizer
   - 生产模式（webpack 下默认开启）

### 参考资料：[Webpack 5 实践：你不知道的 Tree Shaking](https://juejin.cn/post/7105022295474700295)

## clean-webpack-plugin

### 基本

1. 用于清除打包产物，默认清除的是 output 的产出

### 使用

```javascript
new CleanWebPack("文件名", {
  root: "", // 定义文件目录，新版本已废弃；情景：打包产物置于项目顶层，需配置
});
```
