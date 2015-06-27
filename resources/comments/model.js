var bluebird = require('bluebird')
var _ = require('lodash')
var NeDB = require('nedb')
var db = new NeDB({
  filename: 'comments.db',
  autoload: true
})

db = bluebird.promisifyAll(db)

exports.create = function* (url, body) {
  var body = _.merge({}, {
    url: url,
    date: Date.now()
  }, body)
  var saved = yield db.insertAsync(body)
  return saved
}

exports.readAll = function* (url) {
  return yield db.findAsync({url: url})
}
