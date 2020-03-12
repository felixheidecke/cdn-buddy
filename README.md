# cdn-buddy
Load JS and CSS from a CDN of your choosing.
Supports requirejs config files.

## Install

```node
npm i --save cdn-buddy
```

## Usage

```js
const cdn = require('cdn-buddy')
cdn.config = require('./config.example.json')

let dependencies = [
  'jquery',
  'vue@2.6.11/dist/vue.js',
  'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js'
]

cdn.require(dependencies).then( () => {
  // Your dependent code here
}).catch( err => {
  // Ups, better do some error handling
})
```
### @TODO

- Better implementation of requirejs config support
- Add "defer" option
