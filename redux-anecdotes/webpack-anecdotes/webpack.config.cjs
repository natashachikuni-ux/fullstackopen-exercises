const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js',
    publicPath: '/',
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname),
    },
    compress: true,
    port: 3000,
    hot: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        type: 'javascript/auto',
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            configFile: false,
            sourceType: 'unambiguous',
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }],
              '@babel/preset-react'
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}