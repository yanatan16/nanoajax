exports.ajax = function (properties, callback) {
  var url = properties.url
  var postBody = properties.postBody
  var headers = properties.headers || {}
  var method = (properties.method || (postBody ? "POST" : "GET")).toUpperCase()

  var req = getRequest()

  if (!req) return callback(new Error('no request'))

  req.onreadystatechange = function () {
    if (req.readyState == 4)
      callback(req.status, req.responseText)
  }

  if (["PUT", "PATCH", "POST"].indexOf(method) > -1) {
    req.open(method, url, true)
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
