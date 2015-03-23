nanoajax
========

[![Build Status](https://travis-ci.org/yanatan16/nanoajax.svg)](https://travis-ci.org/yanatan16/nanoajax)



An ajax library you need a microscope to see.

Weighs in at 415 bytes gzipped, 623 bytes minified. It is very basic, but cross-browser compatible

_NOTE_: The `POST` api has changed in version v0.2.1, see second example below for details.

## Releases

The latest release (v0.2.1) includes custom header support but is larger than the previous release, v0.1.1.

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
nanoajax.ajax('/some-get-url', function (code, responseText) { ... })
```

POST

```javascript
nanoajax.ajax({url: '/some-post-url', method: 'POST', body: 'post=content&args=yaknow'}, function (code, responseText, request) {
    # code is response code
    # responseText is response body as a string
    # request is the xmlhttprequest, which has `getResponseHeader(header)` function
})
```

## Options

- `url` required
- `method` `"GET", "POST", "PUT", etc`
- `body` string body (if its not url-encoded, make sure to set `Content-Type` header)
- `headers` header object
- `withCredentials` `true or false` only applicable to CORS (does not work in IE)

## Compatibility

`nanoajax` works on android, ios, IE8+, and all modern browsers.

_CORS Note_: `nanoajax` does _not_ support IE8 cross-domain requests.

## License

MIT found in `LICENSE` file.

