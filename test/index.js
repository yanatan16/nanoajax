var assert = require('assert')

suite('nanoajax', function () {
  test('get', function (done) {
    nanoajax('/get', function (code, body) {
      assert.equal(body, 'OK')
      assert.equal(code, 200)
      done()
    })
  })

  test('post', function (done) {
    nanoajax('/post', 'arg=value&foo=bar', function (code, body) {
      assert.equal(body, 'OK')
      assert.equal(code, 200)
      done()
    })
  })

  test('error', function (done) {
    nanoajax('/error', function (code, body) {
      assert.strictEqual(body, "Error")
      assert.equal(code, 500)
      done()
    })
  })
})