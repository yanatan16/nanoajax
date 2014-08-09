var assert = require('assert')

var njx = require('../index')

suite('browserify', defineTests(njx.ajax))
suite('minified', defineTests(window.nanoajax.ajax))

function defineTests(ajax) {
  return function () {
    test('isfunc', function () {
      assert(typeof ajax === 'function')
      assert(ajax.length === 3)
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
  }
}