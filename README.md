nanoajax
========

[![Build Status](https://travis-ci.org/yanatan16/nanoajax.svg)](https://travis-ci.org/yanatan16/nanoajax)



An ajax library you need a microscope to see.

Weighs in at 356 bytes gzipped, 534 bytes minified. It is very basic, but cross-browser compatible

## Install

Can be used via browserify:

```
npm install nanoajax
```

```javascript
var nanoajax = require('nanoajax')
```

Or you can use the global script:

```html
<script src="/nanoajax.min.js"></script>
```

(You can build that script with: `npm install -g uglify-js && ./make`)

## Use

GET

```javascript
nanoajax.ajax('/some-get-url', function (code, responseText) {

})
```

POST

```javascript
nanoajax.ajax('/some-post-url', 'post=content&args=yaknow', function (code, responseText) {

})
```

## License

MIT found in `LICENSE` file.

