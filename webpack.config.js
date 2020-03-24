module.exports = [{
  name: 'app',
  entry: ['./buddy.js'],
  output: {
    filename: 'cdn-buddy.min.js'
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }]
  }
}]
