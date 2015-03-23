var XDR = global.XDomainRequest
  , XHR = global.XMLHttpRequest

exports.ajax = function (url, postBody, headers, callback) {
  if (typeof postBody != 'string') callback = headers, headers = postBody, postBody = null
  if (typeof headers != 'object') callback = headers, headers = {}
  var type = postBody ? "POST" : "GET"

  var req = getRequest(url[0] != '/')
  if (!req) return callback(new Error('no request'))

  req.onreadystatechange = function () {
    if (req.readyState == 4)
      callback(req.status, req.responseText)
  }

  if (XDR && req instanceof XDR) {
    req.onload = function () { callback(null, req.responseText) }
    req.onerror = function () { callback(599, 'XDomainRequest Error') }
    req.open(type, url)
  } else {
    req.open(type, url, true)

    if (postBody) {
      setDefault(headers, 'X-Requested-With', 'XMLHttpRequest')
      setDefault(headers, 'Content-Type', 'application/x-www-form-urlencoded')
    }

    for (var field in headers)
      req.setRequestHeader(field, headers[field])
  }

  setTimeout(function () { req.send(postBody) }, 0)
}

function getRequest(xdr) {
  // if (xdr && XDR)
  //   return new XDR
  if (XHR)
    return new XHR
  else
    try { return new global.ActiveXObject("MSXML2.XMLHTTP.3.0"); } catch(e) {}
}

function setDefault(obj, key, value) {
  obj[key] = obj[key] || value
}