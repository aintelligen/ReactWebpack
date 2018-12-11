const path = require("path");
const htmlWebpackPlugin = require('html-webpack-plugin');
const webapckMerge = require('webpack-merge');
const webpack = require('webpack');
const baseWebpackConfig = require('./webpack.base.config');
const config = require('../config');

function abPath(dir) {
  return path.join(__dirname, dir);
}

const prodWebpackConfig = webapckMerge(baseWebpackConfig, {
  mode: 'production',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new htmlWebpackPlugin()
  ]
});
// --report
if (config.build.bundleAnalyzer) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  prodWebpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = prodWebpackConfig;


