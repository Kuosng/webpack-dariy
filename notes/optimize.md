## Tree Shaking

### 基本

1.  Tree Shaking 用于剔除 dead code
2.  由于不能动态解析，所以依赖静态的 ESM （模块依赖关系高度确定）
3.  副作用（在导入时会执行特殊行为的代码）：由于 Terser 在执行 Tree Shaking 时，判断存在副作用的代码是否对项目”有害“是非常麻烦的，所以选择将副作用保留，手动注释副作用无害：

    - /_#**PURE**_/：语句层面
    - sideEffects：默认 true，模块层面

    ```javascript
    // package.json
    {
    "name": "your-project",
    "sideEffects": ["./src/some-side-effectful-file.js"] // 数组内的模块有副作用
     "sideEffects": false // 项目模块均无副作用
    }

    // 导入 css 为特殊情况：因其未被消费，所以会被直接删除
    ```

### 使用

1. 配置 babel 保留 es6 模块化语句
2. 模式：
   - 开发模式
   1. optimization.usedExports：启用标记功能，标记为 unused 的导出语句会被删除（但没有删除导入语句）
   2. 启用代码压缩工具（erser 插件，删除所有引用被标记内容的代码语句） mode = production；optimization.minimize = true；
      optimization.minimizer
   - 生产模式（webpack 下默认开启）

### 实践

1. 项目开发
   - 不使用 sideEffects: false：泵识别 MiniCssExtractPlugin 抽离的 css，会进行删除
   - babel-plugin-import：按需引入不支持 ESM 的第三方库
2. 库开发
   - 使用 sideEffects: false
   - 使用 ESM 格式的 bundle（为支持浏览器的兼容性问题，在 package.json 文件下定义'module'字段，实现当解析到当前库时，若打包工具支持该字段，优先使用 module 下的打包产物）
   - 使用 Rollup，因为支持 ESM 格式的打包

### 参考资料：[Webpack 5 实践：你不知道的 Tree Shaking](https://juejin.cn/post/7105022295474700295)
