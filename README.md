# cdn-buddy
Load JS and CSS from a CDN of your choosing.
Supports requirejs config files.

## Install

```node
npm i --save cdn-buddy
```

## Usage (Webpack)

### In Webpack

```js
const cdn = require('cdn-buddy')
cdn.config = require('./config.example.json')

(async function() {
  await cdn.require(['jquery', 'vue@2.6.11/dist/vue.js'])

  // Your dependent code goes here
})()
```

### In the Browser

```html
<script src="cdn-buddy/dist/cdn-buddy.min.js">
```
```js
cdnBuddy.config = {
  "baseUrl" : "https://unpkg.com/",
  "paths": {
    "jquery" : "jquery@3.4.1/dist/jquery.min.js"
  }
}

cdnBuddy.require(['jquery', 'vue@2.6.11/dist/vue.js']).then(function() {
  $('body').css('backgroundColor', 'lime')
})
```

_There will be NO AMD support, as it defeats the purpose of the script!_

### @TODO

- Better documentation
- Better implementation of requirejs config support
