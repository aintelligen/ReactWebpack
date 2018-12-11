const path = require("path");
function abPath(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  entry: {
    app: abPath('../src/index.jsx')
  },
  output: {
    path: abPath('../dist'),
    filename: '[name].[hash].js'
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.less', 'css']
  },
  module: {
    rules: [
      {
        test: /.jsx$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        },
      },
      {
        test: /.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
        exclude: [
          abPath('../node_modules')
        ]
      },
    ]
  }
}
