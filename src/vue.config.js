const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const appPath = `${__dirname}/src`;

module.exports = {
  lintOnSave: true,
  runtimeCompiler: true,
  outputDir: 'public',
  css: { extract: {
      filename: 'css/style.css',
      chunkFilename: 'css/[id].css',
    } },
  configureWebpack: {
    entry: { app: `${appPath}/main.js` },
    resolve: {
      alias: {
        '@': appPath,
      },
      symlinks: false,
    },
    module: { rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: file => (
            /node_modules/.test(file)
            && !/\.vue\.js/.test(file)
          ),
        },
      ] },
    output: {
      filename: 'js/script.js',
      chunkFilename: 'js/[id].js',
    },
    plugins: [
      new HtmlPlugin({
        template: `${appPath}/assets/index.html`,
        hash: true,
      }),
      new CopyPlugin([
        {
          from: `${appPath}/assets/img`,
          to: `public/assets/img`
        },
      ]),
    ],
  },
};
