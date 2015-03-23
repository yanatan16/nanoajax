var assert = require('assert')

var njx = require('../index')

suite('browserify', defineTests(njx.ajax))
suite('minified', defineTests(window.nanoajax.ajax))

function defineTests(ajax) {
  return function () {
    test('isfunc', function () {
      assert(typeof ajax === 'function')
      assert(ajax.length === 4)
    })

    test('get', function (done) {
      ajax('/get', function (code, body) {
        assert.equal(body, 'OK')
        assert.equal(code, 200)
        done()
      })
    })

    test('post', function (done) {
      ajax('/post', 'arg=value&foo=bar', function (code, body) {
        assert.equal(body, 'OK')
        assert.equal(code, 200)
        done()
      })
    })

    test('error', function (done) {
      ajax('/error', function (code, body) {
        assert.strictEqual(body, "Error")
        assert.equal(code, 500)
        done()
      })
    })

    test('cors', function (done) {
      ajax('/cors-url', function (code, body) {
        assert.equal(code, 200)
        body = body.replace(/https?/, window.location.toString().split('://')[0])
        console.log('got cors url ' + body)
        try {
        ajax(body + '/cors', function (code, body) {
          if (/MSIE8/.test(window.navigator.userAgent))
            assert.equal(code, null)
          else
            assert.equal(code, 200)
          assert.equal(body, 'COORS')
          done()
        })
      } catch(e) { console.log (e.toString())}
      })
    })

    test('extra header', function (done) {
      ajax('/header', {'X-Custom': 'custom'}, function (code, body) {
        assert.equal(body, 'custom')
        assert.equal(code, 200)
        done()
      })
    })

    test('json post', function (done) {
      ajax('/post', '{"arg":"value","foo":"bar"}', {'Content-Type': 'application/json'}, function (code, body) {
        assert.equal(body, 'OK')
        assert.equal(code, 200)
        done()
      })
    })
  }
}