var express = require('express');
var logger = require('morgan');
var webpack = require('webpack');
var webpackMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('./webpack.dev.config')
var path = require('path')
var app = express();
var compiler = webpack(config);

// express.js
var cookieParse = require('cookie-parser')
var compression = require('compression')
var viewRoot = path.normalize(__dirname, '/..');

app.set('view engine', 'html')
app.set('views', viewRoot+'/views')
app.engine('.html', require('ejs')._express)
app.use(compression)
app.use(cookieParse)

// ...js
app.use(webpackMiddleware(complier,{
  noInfo: false,
  publicPath: config.output.publicPath,
  hot: true,
  info: false,
  progress: false,
  quiet: false,
  stats: {
    colors: true,
    chunks: false
  }
}));
app.use(logger('dev'));
app.use(webpackHotMiddleware(complier));

// server.js






