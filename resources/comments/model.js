var bluebird = require('bluebird')
var _ = require('lodash')
var NeDB = require('nedb')
var db = new NeDB({
  filename: 'comments.db',
  autoload: true
})

db = bluebird.promisifyAll(db)

exports.create = function* (url, body) {
  var body = _.merge({}, body, {
    url: url,
    date: body.date || Date.now()
  })
  var saved = yield db.insertAsync(body)
  return saved
}

exports.readAll = function* (url) {
  return yield db.findAsync({url: url})
}
