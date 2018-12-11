const path = require('path')
function resolve(relatedPath) {
  return path.join(__dirname, relatedPath)
}
module.exports = {
  entry: resolve('../app/index.jsx'),
  output: {
    path: resolve('../dist'),
    filename: 'bundle.[hash].js'
  },
  resolve: {
    extensions: ['.jsx', '.js', '.less'],
    alias: {
      "react": "preact-compat",
      "react-dom":"preact-compat"
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          }
        },
        include: resolve('../app'),
        exclude: resolve('../node_modules')
      }
    ]
  }
}