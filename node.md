webpack：

- 作用：

  1. 体现各个模块的依赖关系，保证依赖关系前提，避免程序无法运行
  2. 不加载不被引入的依赖

- 组成

  1. entry：入口，也即模块依赖图的起点
  2. output：输出的 bundles 文件
  3. sourceMap：将编译、打包、压缩后的代码映射回源代码，方便定位到 bug 问题
  4. loader：
     1. webpack 只能处理 js 文件，所以需要使用其预处理非 JS 文件 webpack 能够处理的有效模块
     2. 每个文件类型，支持数组的形势配置多个，按数组的反顺序链式调用，前一个返回的内容会作为后一个 loader 的入参
  5. plugins：
     1. 负责功能扩展
     2. webpack 基于发布订阅模式，在生命周期中会广播许多事件（compiler 和 compilation 暴露），插件监听事件，执行插件任务
  6. mode：development | production

- 专有名词概念

  1. Module：每一个文件相当于一个 module
  2. Chunk（过程中的代码块）：一堆 module 的集合
     1. 产生 Chunk 的三种途径
        1. entry 入口
        2. 异步加载模块
        3. 代码分割（code spliting）
     2. 参考
        1. https://juejin.cn/post/6844903889393680392
  3. Bundle（结果的代码块）：打包文件

- 热更新(Hot Module Replacement)

- 打包运行原理

1. 读取 webpack 的配置参数
2. 启动 webpack，创建 Compiler 对象并开始解析项目
3. 从入口文件（entry）开始解析，根据文件类型使用对应的 Loader 进行编译，再找到其依赖模块，递归本步骤，各个模块的依赖关系形成 AST 语法树
4. 根据入口和模块之间的依赖关系，将若干个模块组成 chunk
5. 将 chunk 输出到为最终的 bundle 文件
6. 整个过程中 webpack 会通过发布订阅模式，向外抛出一些 hooks，而 webpack 的插件即可通过监听这些关键的事件节点，执行插件任务进而达到干预输出结果的目的。

tips：

1. 安装 package 时，若要打包到生产环境，使用--save，若用于开发环境，使用--save-dev

## 参考资料

1. https://juejin.cn/post/6943468761575849992d
2. https://juejin.cn/post/6844904008432222215

面试：

1. webpack 打包原理？、
   1. 读取 webpack 的配置参数
   2. 启动 webpack，创建 Compiler 对象并开始解析项目
   3. 从入口文件（entry）开始解析，根据文件类型使用对应的 Loader 进行编译，再找到其依赖模块，递归本步骤，各个模块的依赖关系形成 AST 语法树
   4. 根据入口和模块之间的依赖关系，将若干个模块组成 chunk
   5. 将 chunk 输出到为最终的 bundle 文件
   6. 整个过程中 webpack 会通过发布订阅模式，向外抛出一些 hooks，而 webpack 的插件即可通过监听这些关键的事件节点，执行插件任务进而达到干预输出结果的目的。
2. webpack 优化：要么时间，要么空间？

   1. 构建：

      1. 搜索匹配文件：
         1. resolve：加快 webpack 的搜索速度
            1. modules：设置第三方模块的搜索范围
            2. mainFields：设置模块的入口文件，一般写成是文件夹，所以写死了，就不用再去搜索是文件夹的哪个文件了
            3. extensions：定义文件的查找后缀；
               1. 列表数组要小
               2. 源码文件中尽量为导入文件加上后缀，避免查找过程；
               3. 后缀按优先级降序
         2. module：
            1. noParse：减少解析非模块化库文件，即不用分析其依赖关系
         3. loader：
            1. 缩小 test、exclude、include 的搜索范围
      2. 匹配的文件进行解析

         1. 使用 HappyPack / thread-loader 开启多进程 Loader 转换：运行在 node.js 中的 webpack 是单线程的，需一个一个使用 loader 对文件进行转化

            1. note：线程属于进程

         2. DllPlugin：减少基础模块编译次数，将其抽取为公共文件？？？？

         3. ParallelUglifyPlugin：开启多进程压缩 JS 文件

      3. 合理利用缓存，优化二次构建
         1. cache-loader：存储转换后的 loader

   2. 优化开发体验

      1. watch：监听文件变化
         1. ignored：排除不监听目录
      2. 开启热更新

   3. 优化输出质量-压缩文件体积

      1. 区分环境，为不同的环境配置不同 webpack 配置，减少不必要的打包
      2. 提取公共代码库
      3. 压缩代码 JS、ES、CSS
      4. 使用 Tree Shaking 剔除 JS 死代码

   4. 优化输出质量--加速网络请求 1. 使用 CDN 加速静态资源的查找
      ~~5. 优化输出质量--提升代码运行时的效率~~
      5.source map 是什么？生产环境怎么用？

3. source map 是什么？生产环境怎么用？
   1. 映射源代码
4. 模块打包原理知道吗？
5. Loader 和 Plugin 的区别？
   ~~6. 文件监听原理呢？~~
6. 说一下 Webpack 的热更新原理吧？（参考：https://zhuanlan.zhihu.com/p/30669007）
   1. 服务端：
      1. 系统文件变更，webpack 监听到到文件，重新打包
      2. webpack-dev-server 将 webpack 打包的文件存入到内存中
      3. 通过 websocket 链接，服务端传递新模块的 hash 值给客户端，
      4. 客户端对比模块 hash 值、发送有模块更新了。
      5. HotModuleReplacement.runtime 通过 JsonpMainTemplate.runtime 发送请求，获取需要更新的模块的 hash 值，再通过此获取到新的模块
      6. 浏览器端对比新旧模块代码，决定是否更新就（根据 hash 值命中对比）
7. 如何对 bundle 体积进行监控和分析？
   1. 使用 webpack-bundle-analyzer 生成 bundle 模块依赖图
8. 文件指纹是什么？怎么用？
   1. 唯一标识
      1. Hash：每次重新构建的生成，即 compilation 实例的变化
      2. Chunkhash：每个 entry
      3. Contenthash：内容变化
   2. 作用：版本管理 和 使用缓存
9. 如何保证各个 loader 按照预想方式工作？
10. 使用 enforce：pre 最先；post 最后
11. 代码分割的本质是什么？有什么意义呢？
    1. 分割成不同的 chunk，减少加载文件的体积，按需引入
12. 编写 loader 的思路
    1. 自定义一个函数
    2. 将匹配的内容作为参数
    3. 返回转换后的内容
13. 编写 Plugin 的思路
    1. 可以接收 compiler / compilation 实例的函数或包含这个方法的对象
    2. 找到 compiler 的 hooks 定义自己插件的功能
       ~~13. Babel 原理~~
