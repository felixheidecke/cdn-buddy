# cdn-buddy
Browser friendly, promise based JS and CSS loader.

### It's all global

cdn-buddy will live in a variable you may declare:

`__CDN_BUDDY_NAMESPACE = 'myBuddy' // defaults to cdnBuddy` 

### In your build pipeline

```js
__CDN_BUDDY_NAMESPACE = 'cdn'
require('cdn-buddy')

cdn.setConfig({
  "baseUrl" : "https://unpkg.com/",
  "paths": {
    "jquery" : "jquery@3.4.1/dist/jquery.min.js"
  }
})

(async function() {
  await cdn.require(['jquery', 'vue@2.6.11/dist/vue.js'])
  await cdn.require(['jquery-ui'])

  // Your dependent code goes here
})()
```

### In the Browser

```html
<script src="cdn-buddy/dist/cdn-buddy.min.js"></script>
<script>
cdnBuddy.require(['jquery', 'vue@2.6.11/dist/vue.js']).then(function() {
  $('body').css('backgroundColor', 'lime')
})
</script>