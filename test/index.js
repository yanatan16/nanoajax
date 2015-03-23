var assert = require('assert')

var njx = require('../index')

suite('browserify', defineTests(njx.ajax))
suite('minified', defineTests(window.nanoajax.ajax))

function defineTests(ajax) {
  return function () {
    test('isfunc', function () {
      assert(typeof ajax === 'function')
      assert(ajax.length === 2)
    })

    test('get', function (done) {
      ajax('/get', function (code, body) {
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

    test('cors', function (done) {
      ajax('/cors-url', function (code, body) {
        assert.equal(code, 200)
        console.log('got cors url', body)
        ajax(body + '/cors', function (code, body) {
          assert.equal(code, 200)
          assert.equal(body, 'COORS')
          done()
        })
      })
    })

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

    test('withCredentials', function (done) {
      ajax('/cors-url', function (code, body) {
        ajax({
          url: body + '/cookie-setter'
        , withCredentials: true
        }, function (code, cookieValue) {
          ajax({
            url: body + '/cookie-verifier?cookie_value=' + cookieValue
          , withCredentials: true
          }, function (code) {
            assert.equal(code, 200, 'Server could not verify cookie value')
            done()
          })
        })
      })
    })
  }
}
