module.exports = [{
  name: 'app',
  entry: ['./amd.js'],
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
          plugins: [['@babel/plugin-transform-runtime', {
            corejs: 2
          }]],
          presets: [['@babel/preset-env', {
            modules: 'amd'
          }]]
        }
      }
    }]
  }
}]
