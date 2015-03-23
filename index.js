exports.ajax = function (url, postBody, headers, callback) {
  if (typeof postBody != 'string') callback = headers, headers = postBody, postBody = null
  if (typeof headers != 'object') callback = headers, headers = {}

  var req = getRequest()
  if (!req) return callback(new Error('no request'))

  req.onreadystatechange = function () {
    if (req.readyState == 4)
      callback(req.status, req.responseText)
  }

  if (postBody) {
    req.open("POST", url, true)
    setDefault(headers, 'X-Requested-With', 'XMLHttpRequest')
    setDefault(headers, 'Content-Type', 'application/x-www-form-urlencoded')
  } else {
    req.open("GET", url, true)
  }

  for (var field in headers)
    req.setRequestHeader(field, headers[field])

  req.send(postBody)
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