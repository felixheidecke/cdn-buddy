# cdn-buddy
Load JS and CSS from a CDN of your choosing

## Install

`npm install felixheidecke/cdn-buddy --save`

## Usage

```js
const cdn = require('cdn-buddy')
cdn.config = require('./config.example.json')

cdn.require(['jquery', 'pure']).then( () => {

  // Your dependent code here
})
```
