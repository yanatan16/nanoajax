nanoajax
========

An ajax library you need a microscope to see.

Weighs in at **620 bytes** gzipped and minified. It is very basic, but contains support for cross-domain requests back to somewhat older browsers (See [Compatibility](#compatibility)).

## API Changes

- Passing a string url instead of a params object has been removed in `v0.4.0`
- The params object was introduced in `v0.2.1`, and is the only way to use `POST` requests.
- Passing a FormData object as the body will cause the Content Type header to not be set, as appropriate.

## Install

You can use npm or bower:

```
npm install --save nanoajax
```

```
bower install --save nanoajax
```

Can be used via browserify or webpack:

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
nanoajax.ajax({url:'/some-get-url'}, function (code, responseText) { ... })
```

POST

```javascript
nanoajax.ajax({url: '/some-post-url', method: 'POST', body: 'post=content&args=yaknow'}, function (code, responseText, request) {
    # code is response code
    # responseText is response body as a string
    # request is the xmlhttprequest, which has `getResponseHeader(header)` function
})
```

## Documentation

```
var xhrRequest = nanoajax.ajax(params, callback)
```

Simple and small ajax function. Takes a parameters object and a callback function.

Parameters:

- `url`: string, required
- `headers`: object of `{header_name: header_value, ...}`
- `body`:
    + string (sets content type to 'application/x-www-form-urlencoded' if not set in headers)
    + FormData (doesn't set content type so that browser will set as appropriate)
- `method`: 'GET', 'POST', etc. Defaults to 'GET' or 'POST' based on body
- `cors`: If your using cross-origin, you will need this true for IE8-9 (to use the XDomainRequest object, also see [Compatibility](#compatibility))

The following parameters are passed directly onto the request object:

**IMPORTANT NOTE**: The caller is responsible for compatibility checking.

- `responseType`: string, various compatability, see xhr docs for enum options
- `withCredentials`: boolean, IE10+, CORS only
- `timeout`: long, ms timeout, IE8+
- `onprogress`: callback, IE10+

Callback function prototype:

- `statusCode`: integer status or null
    + if request errors for some browsers (notably Chrome), this is 0 (and `response` is "Error")
- `response`:
    + if `responseType` set and supported by browser, this is an object of some type (see docs)
    + otherwise if request completed, this is the string text of the response
    + if request is aborted, this is `"Abort"`
    + if request times out, this is `"Timeout"`
    + if request errors before completing (probably a CORS issue), this is `"Error"`
- request object

Returns the request object. So you can call .abort() or other methods

## Compatibility

`nanoajax` works on android, iOS, IE8+, and all modern browsers, with some (_known_) caveats.

- Safari is conservative with cookies and will not allow cross-domain cookies to be set from domains that have never been visited by the user.
- IE8 and IE9 do not support cookies in cross-domain requests in this library. There are other solutions out there, but this library has chosen small over edge case compatibility.

## License

MIT found in `LICENSE` file.
