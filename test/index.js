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
      ajax({url: '/get'}, function (code, body) {
        assert.equal(body, 'OK')
        assert.equal(code, 200)
        done()
      })
    })

    test('post', function (done) {
      ajax({
        url: '/post'
      , postBody: 'arg=value&foo=bar'
      }, function (code, body) {
        assert.equal(body, 'OK')
        assert.equal(code, 200)
        done()
      })
    })

    test('error', function (done) {
      ajax({url: '/error'}, function (code, body) {
        assert.strictEqual(body, "Error")
        assert.equal(code, 500)
        done()
      })
    })

    test('cors', function (done) {
      ajax({url: '/cors-url'}, function (code, body) {
        assert.equal(code, 200)
        console.log('got cors url', body)
        ajax({url: body + '/cors'}, function (code, body) {
          assert.equal(code, 200)
          assert.equal(body, 'COORS')
          done()
        })
      })
    })

    test('extra header', function (done) {
      ajax({
        url: '/header'
      , headers: {'X-Custom': 'custom'}
      }, function (code, body) {
        assert.equal(body, 'custom')
        assert.equal(code, 200)
        done()
      })
    })

    test('json post', function (done) {
      ajax({
        url: '/post'
      , postBody: '{"arg":"value","foo":"bar"}'
      , headers: {'Content-Type': 'application/json'}
      }, function (code, body) {
        assert.equal(body, 'OK')
        assert.equal(code, 200)
        done()
      })
    })
  }
}
