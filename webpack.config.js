module.exports = [{
  name: 'app',
  entry: './common.js',
  output: {
    filename: 'cdn-buddy.min.js'
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ["@babel/preset-env"]
         }
      }
    }]
  }
}]
