var express = require('express')
  , fs = require('fs')
  , app = express()

app.use(require('morgan')('dev'))
app.use(require('body-parser').urlencoded({extended:false}))

app.get('/nanoajax.js', function (req, res) {
  fs.createReadStream(__dirname + '/../index.js', {encoding:'utf8'})
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

app.get('/error', function (req, res) {
  res.status(500).send('Error')
})

app.listen(process.env.ZUUL_PORT)