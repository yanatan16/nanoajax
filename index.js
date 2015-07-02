// Best place to find information on XHR features is:
// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpReques

var reqfields = [
  'responseType', 'withCredentials', 'onerror',
  'timeout', 'ontimeout', 'onabort', 'onprogress'
]

// Simple ajax function of parameter argument and oncomplete callback
// Parameters:
//  - url: string, required
//  - headers: object
//  - body: string (sets content type if not set in headers)
//  - method: 'GET', 'POST', etc. Defaults to 'GET' or 'POST' based on body
//
// The following parameters are passed onto the xhr object.
// The caller is responsible for compatibility checking.
//  - responseType: string, various compatability, see xhr docs for enum options
//  - withCredentials: boolean, IE10+, CORS only
//  - onerror: callback, IE8+ (confirm?), CORS only
//  - timeout: long, ms timeout, IE8+
//  - ontimeout: callback, IE8+
//  - onabort: callback
//  - onprogress: callback, IE10+
//
// Returns the XHR object. So you can call .abort() or other methods
exports.ajax = function (params, callback) {
  var headers = params.headers || {}
    , body = params.body
    , method = params.method || (body ? 'POST' : 'GET')

  var req = getRequest()

  req.onreadystatechange = function () {
    if (req.readyState == 4)
      callback(req.status, req.response, req)
  }

  if (body) {
    setDefault(headers, 'X-Requested-With', 'XMLHttpRequest')
    setDefault(headers, 'Content-Type', 'application/x-www-form-urlencoded')
  }

  req.open(method, typeof params === 'string' ? params : params.url, true)

  for (var i = 0, len = reqfields.length, field; i < len; i++) {
    field = reqfields[i]
    if (params[field] !== undefined)
      req[field] = params[field]
  }

  for (var field in headers)
    req.setRequestHeader(field, headers[field])

  req.send(body)

  return req
}

function getRequest() {
  if (global.XMLHttpRequest)
    return new global.XMLHttpRequest;
  else
    try { return new global.ActiveXObject("MSXML2.XMLHTTP.3.0"); } catch(e) {}
  throw new Error('no xmlhttp request able to be created')
}

function setDefault(obj, key, value) {
  obj[key] = obj[key] || value
}
