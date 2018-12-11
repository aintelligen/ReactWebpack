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

/* const devWebpackConfig = webapckMerge(baseWebpackConfig,{
  mode:'development',
  devtool:'source-map',
  devServer:{
    contentBase: abPath('../dist'),
    compress: true,
    port: 9000,
    hot: true,
    host: IPv4,
    open: true
  },
  module: {
    rules: [
      {
        test: /.(less|css)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader',
            options: {
              paths: [
                abPath("../node_modules")
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new htmlWebpackPlugin({
      title:'React app',
      filename: 'index.html',
      template: abPath('../index.html'),
      inject: true
    })
  ]
}); */
const devWebpackConfig = webapckMerge(baseWebpackConfig, {
  mode: 'development',
  output: {
    // chunkFilename: '[name].js',
    // publicPath: '/client/'
  },
  devtool: 'source-map',
  devServer: {
    contentBase: abPath('../dist'),
    compress: true,
    port: 9000,
    hot: true,
    host: getIp(OS),
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:9001'
    }
  },
  module: {
    rules: [
      {
        test: /.(less|css)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader',
            options: {
              paths: [
                abPath("../node_modules")
              ]
            }
          }
        ]
      }
    ]
  },
  optimization: {
    /* splitChunks: {
      chunks: 'initial', 
      cacheGroups: {
        vendor: { // split `node_modules`目录下被打包的代码到 `page/vendor.js && .css` 没找到可打包文件的话，则没有。css需要依赖 `ExtractTextPlugin`
          test: /node_modules\//,
          name: 'page/vendor',
          priority: 10,
          enforce: true
        },
        commons: { // split `common`和`components`目录下被打包的代码到`page/commons.js && .css`
          test: /common\/|components\//,
          name: 'page/commons',
          priority: 10,
          enforce: true
        }
      }
    }, */
    /* runtimeChunk: {
      name: 'page/manifest'
    } */
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new htmlWebpackPlugin({
      title: 'React app',
      filename: 'index.html',
      template: abPath('../index.html'),
      inject: true,
      favicon: abPath('../favicon.ico')
    })
  ]
});
module.exports = devWebpackConfig;