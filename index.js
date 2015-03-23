exports.ajax = function (params, callback) {
  if (typeof params == 'string') params = {url: params}
  var headers = params.headers || {}
    , method = params.method || 'GET'

  var req = getRequest()
  if (!req) return callback(new Error('no request'))

  req.onreadystatechange = function () {
    if (req.readyState == 4)
      callback(req.status, req.responseText)
  }

  if (params.body) {
    setDefault(headers, 'X-Requested-With', 'XMLHttpRequest')
    setDefault(headers, 'Content-Type', 'application/x-www-form-urlencoded')
  }

  req.open(method, params.url, true)

  for (var field in headers)
    req.setRequestHeader(field, headers[field])

  req.send(params.body)
}

function getRequest() {
  if (global.XMLHttpRequest)
    return new global.XMLHttpRequest;
  else
    try { return new global.ActiveXObject("MSXML2.XMLHTTP.3.0"); } catch(e) {}
}

function setDefault(obj, key, value) {
  obj[key] = obj[key] || value
}