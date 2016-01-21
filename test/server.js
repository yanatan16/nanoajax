var express = require('express')
  , fs = require('fs')
  , localtunnel = require('localtunnel')
  , app = express()

var tunnel = localtunnel(process.env.ZUUL_PORT, function (err, tunnel) {
  if (err)
    throw err
})

function corsify(req, res) {
  // IE 6-7 requires this P3P header
  res.setHeader('P3P', 'CP="IDC DSP COR CURa ADMa OUR IND PHY ONL COM STA"')

  // Standards-compatible CORS headers
  res.setHeader('Access-Control-Allow-Origin', req.get('origin') || '*')
  res.setHeader('Access-Control-Allow-Credentials', true)

  res.setHeader('Cache-Control', 'no-cache')
}

app.use(require('morgan')('dev'))
app.use(require('body-parser').urlencoded({extended:false}))
app.use(require('body-parser').json())
app.use(require('cookie-parser')())
app.use(require('multer')({ dest: 'temp/ '}).any())

app.get('/nanoajax.min.js', function (req, res) {
  fs.createReadStream(__dirname + '/../nanoajax.min.js', {encoding:'utf8'})
    .pipe(res)
})

app.get('/get', function (req, res) {
  res.send('OK')
})

app.post('/post', function (req, res) {
  if (req.body.arg === 'value' && req.body.foo === 'bar')
    res.send('OK')
  else
    res.status(400).send('Bad Request: ' + JSON.stringify(req.body))
})

app.put('/put', function (req, res) {
  res.send(Object.keys(req.body).length > 0 ? 'OK' : 'NO body?')
})

app.get('/error', function (req, res) {
  res.status(500).send('Error')
})

app.get('/cors-url', function (req, res) {
  res.send(tunnel.url)
})

app.get('/cors', function (req, res) {
  corsify(req, res)
  res.send('COORS')
})

app.get('/header', function (req, res) {
  res.send(req.headers['x-custom'])
})

app.get('/cookie-setter', function (req, res) {
  var randomNumber = (Math.random() + '').substr(2)
  corsify(req, res)
  res.cookie('doge', randomNumber)
  res.send(randomNumber)
})

app.get('/cookie-verifier', function (req, res) {
  corsify(req, res)

  if (req.query.cookie_value !== req.cookies.doge) {
    console.log('Cookie values differ! ' + req.query.cookie_value + ' vs ' + req.cookies.doge)
    res.status(200).send('Could not verify cookie')
  } else {
    res.send('OK')
  }
})

app.listen(process.env.ZUUL_PORT)
