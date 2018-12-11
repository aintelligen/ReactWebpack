const htmlWebpackPlugin = require('html-webpack-plugin');
const webapckMerge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.js');
const cleanWebpackPlugin = require('clean-webpack-plugin')
const webpack = require('webpack')

const path = require('path')
function resolve(relatedPath) {
  return path.join(__dirname, relatedPath)
}
const OS = require('os');
function getIp(os) {
  arr = [], str = "";
  var ipObj = os.networkInterfaces();
  for (var obj in ipObj) {
    for (var i = 0; i < ipObj[obj].length; i++) {
      arr.push(ipObj[obj][i]);
    }
  }
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].address.match('192.168') == '192.168') {
      str = arr[i].address;
      break;
    }
  }
  return str;
}

module.exports = webapckMerge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: resolve('../dist'),
    compress: true,
    port: 9800,
    hot: true,
    host: getIp(OS),
    historyApiFallback: true,
  },
  plugins: [
    new cleanWebpackPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new htmlWebpackPlugin({
      filename: 'index.html',
      template: resolve('../index.html'),
      inject: true
    })
  ]
})