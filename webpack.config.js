const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",

  entry: {
    index: "./src/index.js",
  },

  // 用于追踪源码，生产环境不要使用，因为会暴露源码
  devtool: "inline-source-map",

  /*
   * webpack-dev-server 编译后不会生成输出文件，而是存放在内存中，直接调用
   * 服务入口为 output.path
   */
  devServer: {
    static: "./dist",
  },

  // 修改代码文件（不包括配置文件）时，自动编译代码
  module: {
    rules: [
      // 处理样式文件，使得 js 文件能够使用 'import './style.css' 的方式引入样式
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },

      /*
       * 处理 images 图像，并输出到 output 目录，后面引用该图像的文件，实际上指向的是 output 的图像文件
       * 静态资源的加载
       */
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        type: "asset/resource",
      },

      // 处理 fonts 字体
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },

      /*
       * 处理其他数据文件
       * 这样可以合适地将某些固定数据放在前端打包资源中，而不用加载页面后，再去请求资源
       */
      {
        test: /\.(csv|tsv)$/,
        use: ["csv-loader"],
      },
      {
        test: /\.xml$/,
        use: ["xml-loader"],
      },
    ],
  },

  plugins: [
    // 向 HTML 动态添加 bundel
    new HtmlWebpackPlugin({
      template: "./index.html", // 生成的 html 所参考的模板
      title: "Development",
      filename: "app.html", // 文件名
      inject: "body", // 引入 script 放在 body 中
    }),
  ],

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
    clean: true, // 清理上次输出的文件
  },
};

// notes：
/*
 * 代码分离：把代码分离到不同的bundle中，然后按需记载或并行加载文件
 * 1. 入口起点：手动分离代码
 * 2. 防止重复：入口依赖提取 和 SplitChunksPlugin
 * 3. 动态导入：使用 import()，作用于 js 业务代码层面：如路由组件的引入：() => import()
 */

/*
 * prefetch：浏览器空闲时，请求这些资源
 * preload（预加载）：当请求页面时，告知浏览器同时请求这些资源，因为请求是单次往返，减少了请求的修好；不过需慎用
 */

/*
 * bundle 分析：webpack-bundle-analyzer
 */
