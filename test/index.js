var assert = require('assert')

var njx = require('../index')

var userAgent = navigator.userAgent
  , isChrome = userAgent.indexOf('Chrome') > -1
  , isIE = userAgent.indexOf('MSIE') > -1
  , isFirefox = userAgent.indexOf('Firefox') > -1
  , isSafari = userAgent.indexOf("Safari") > -1 && !isChrome
  , isOpera = userAgent.toLowerCase().indexOf("op") > -1
  , IEversion = isIE ? parseInt(userAgent.match(/MSIE (\d+)/)[1]) : 0

suite('browserify', defineTests(njx.ajax))
suite('minified', defineTests(window.nanoajax.ajax))

function defineTests(ajax) {
  return function () {
    test('isfunc', function () {
      assert(typeof ajax === 'function')
      assert(ajax.length === 2)
    })

    test('get', function (done) {
      ajax({url:'/get'}, function (code, body) {
        assert.equal(body, 'OK')
        assert.equal(code, 200)
        done()
      })
    })

    test('post', function (done) {
      ajax({url: '/post', method: 'POST', body: 'arg=value&foo=bar'}, function (code, body) {
        assert.equal(body, 'OK')
        assert.equal(code, 200)
        done()
      })
    })

    test('put', function (done) {
      ajax({url: '/put', method: 'PUT', body: 'foo=bar'}, function (code, body) {
        assert.equal(body, 'OK')
        assert.equal(code, 200)
        done()
      })
    })

    test('error', function (done) {
      ajax({url:'/error'}, function (code, body) {
        assert.strictEqual(body, "Error")
        assert.equal(code, 500)
        done()
      })
    })

    // CORS can be done in IE 6 and 7, but it takes more than this library provides
    // See easyXDM or jQuery 1.x
    if (!(isIE && IEversion < 8)) {
      test('cors', function (done) {
        ajax({url:'/cors-url'}, function (code, body, req) {
          assert.equal(code, 200)
          ajax({url: body + '/cors', cors: true}, function (code, body) {
            assert.equal(code, 200)
            assert.equal(body, 'COORS')
            done()
          })
        })
      })
    }

    test('extra header', function (done) {
      ajax({url: '/header', headers: {'X-Custom': 'custom'}, method: 'GET'}, function (code, body) {
        assert.equal(body, 'custom')
        assert.equal(code, 200)
        done()
      })
    })

    test('json post', function (done) {
      ajax({url: '/post',
            body: '{"arg":"value","foo":"bar"}',
            method: 'POST',
            headers: {'Content-Type': 'application/json'}}, function (code, body) {
        assert.equal(body, 'OK')
        assert.equal(code, 200)
        done()
      })
    })

    if (window.FormData) {
      test('FormData post', function (done) {
        var formData = new FormData();
        formData.append("arg", "value");
        formData.append("foo", "bar");

        ajax({url: '/post',
              body: formData,
              method: 'POST' }, function (code, body) {
          assert.equal(body, 'OK')
          assert.equal(code, 200)
          done()
        })
      })
    }

    // Safari:
    //   According to some StackOverflow pages,
    //   Safari ships with a conservative cookie policy which limits cookie writes
    //   to only the pages chosen ("navigated to") by the user.
    //   Since this url hasn't been navigated to, this wont work in Safari.
    // IE < 10:
    //   http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
    //   IE's XDomainRequest just doesn't do CORS cookies
    if (!isSafari && !(isIE && IEversion < 10)) {
      test('cors-cookies', function (done) {
        ajax({url:'/cors-url'}, function (code, corsdomain) {
          var args = {url: corsdomain + '/cookie-setter'
                    , cors: true
                    , withCredentials: true
                  }

          ajax(args, function (code, cookieValue) {
            console.log('code/cookievalue: ' + code + ' / ' + cookieValue)
            assert.equal(code, 200)
            assert(/\d+/.test(cookieValue))

            args.url = corsdomain + '/cookie-verifier?cookie_value=' + cookieValue

            ajax(args, function (code, response, req) {
              console.log('RESPONSE: ' + code + ' / ' + response)
              assert.equal(response, 'OK')
              done()
            })
          })
        })
      })

      test('no-connection', function (done) {
        ajax({url:'http://localhost:0000'}, function (code, resp) {
          assert.equal(code, 0)
          assert.equal(resp, "Error")
          done()
        })
      })
    }
  }
}
