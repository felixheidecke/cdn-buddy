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

(async function() {
  await cdn.require(['jquery', 'vue@2.6.11/dist/vue.js']) // async
  await cdn.require(['moment']) // defered

  // Your dependent code goes here
})()
```
### @TODO

- Better documentation
- Add AMD Support
- Better implementation of requirejs config support
