const path = require("path");
const htmlWebpackPlugin = require('html-webpack-plugin');
const webapckMerge = require('webpack-merge');
const webpack = require('webpack');
const baseWebpackConfig = require('./webpack.base.config');
const OS = require('os');

function abPath(dir) {
  return path.join(__dirname, dir);
}
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

const IPv4 = getIp(OS);

const devWebpackConfig = webapckMerge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: abPath('../dist'),
    compress: true,
    port: 9000,
    hot: true,
    host: IPv4,
    open: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new htmlWebpackPlugin({
      title: 'React app',
      filename: 'index.html',
      template: abPath('../src/index.html'),
      inject: true
    })
  ]
});
module.exports = devWebpackConfig;


