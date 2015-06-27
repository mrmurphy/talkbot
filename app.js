var app = require('koa')()
var cors = require('koa-cors')()
var bodyParser = require('koa-body-parser')
var router = require('koa-router')()
var logger = require('koa-logger')
var hogan = require('hogan')
var fs = require('fs')
var moment = require('moment')
var _ = require('lodash')
var marked = require('marked')

var Comments = require('./resources/comments/model')


var PORT = 3030

app.use(cors)
app.use(bodyParser())
app.use(logger())

function* render(url) {
  var tpl = hogan.compile(fs.readFileSync('./views/template.hbs', 'utf8'))
  var comments = yield Comments.readAll(url)
  comments = comments.map(function(c) {
    c.date = moment(c.date).format('MMM DD, hh:mma - YYYY')
    c.body = marked(c.body)
    return c
  })
  comments = _.sortBy(comments, 'date')
  return tpl.render({ comments: comments })
}

router.get('/post/:url', function*() {
  this.type = 'text/html'
  this.body = yield render(this.params.url)
})

router.post('/post/:url', function*() {
  var saved = yield Comments.create(this.params.url, this.request.body)
  this.body = yield render(this.params.url)
})

router.get('/script', function*() {
  this.type = 'text/javascript'
  this.body = fs.readFileSync('./script.js', 'utf8')
})

app.use(router.routes())
app.listen(PORT, function() {
  console.log('Listening on port ' + PORT)
})
