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
  // If no results are returned, try stripping the last letter, and looking
  // for results there. If found, update all comments with the correct URL.
  // This is a temporary bugfix.
  var results = yield db.findAsync({url: url})
  if ((results && results.length == 0) || !results) {
    results = yield db.findAsync({url: url.slice(0, url.length - 1)})
    if ((results && results.length == 0) || !results) {
      return results
    }
    for (var i = 0; i < results.length; i++) {
      var oldUrl = results[i].url
      results[i].url = url
      yield db.updateAsync({_id: results[i]._id}, results[i])
    }
  }
  return results
}
