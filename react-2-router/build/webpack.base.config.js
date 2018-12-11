const path = require("path");
function abPath(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  entry: {
    app: abPath('../src/index.jsx'),
    vendor: ['react', 'react-dom']
  },
  output: {
    path: abPath('../dist'),
    filename: '[name].[hash].js',
    // chunkFilename: '[name].js',
    // publicPath: '/client/'
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.less', '.css', '.jpg', '.png', '.jpeg', '.gif', '.svg',],
    alias: {
      '$components': abPath('../src/components')
    }
  },
  module: {
    rules: [
      {
        test: /.jsx$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env','@babel/preset-react']
          }
        },
      },
      {
        test: /.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env','@babel/preset-react']
          }
        },
        exclude: [
          abPath('../node_modules')
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: abPath('static/img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: abPath('static/media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: abPath('static/fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
