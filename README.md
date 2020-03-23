# cdn-buddy
Load JS and CSS from a CDN (URL) of your choosing.
Data is browser global.

## Install

```node
npm i --save cdn-buddy
```

## Doumentation

### Basic usage

In the ES6 context, you would basically do this:

```js
const cdn = require('cdn-buddy')

(async function() {
  await cdn.require(['https://unpkg.com/jquery@3.4.1/dist/jquery.js'])

  // You can use $ now
})()
```

It also works out of the box, if you use the `dist/cdn-buddy.min.js` that
comes in the [master.zip](https://github.com/felixheidecke/cdn-buddy/archive/master.zip) file for your working pleasure.

```html
<script src="cdn-buddy/dist/cdn-buddy.min.js"></script>
<script>
cdnBuddy.require(['https://unpkg.com/jquery@3.4.1/dist/jquery.js']).then(function() {
  // You can use $ now
})
</script>
```

_There will be NO AMD support, as it defeats the purpose of the script!_

### configuration

`baseUrl` root URL from wich all scripts are loaded. Exept absolute URLs.

```JSON
{
  "baseUrl": "https://unpkg.com/"
}

cdnBuddy.require(['jquery', 'vue@2.6.11/dist/vue.js']).then(function() {
  $('body').css('backgroundColor', 'lime')
})
```




### @TODO

- Better documentation

#### Update 1.0.0

- Drop require.js config support
