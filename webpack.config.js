module.exports = [{
  name: 'app',
  entry: './buddy.js',
  output: {
    filename: 'buddy.js'
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
