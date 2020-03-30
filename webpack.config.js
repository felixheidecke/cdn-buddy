module.exports = env => {
  return {
    name: 'app',
    entry: ['./buddy.js'],
    output: {
      filename: env.FILENAME + '.js'
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
  }
}