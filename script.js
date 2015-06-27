function talkbot(settings) {

  var selector = settings.selector || 'article p'
  var host = settings.host || 'http://talkbot.murph.xyz'

  console.log('Adding talkbot to selector', selector)
  var article = $(selector)

  function insertIntoDom(stringToParse) {
    article.after($.parseHTML(stringToParse)[0])
  }

  function replaceWithInDom(stringToParse) {
    $('#talkbot-wrapper').replaceWith($.parseHTML(stringToParse)[0])
  }

  function currentURL() {
    var cat = location.host + location.pathname
    if (cat.endsWith('/')) {
      cat = cat.slice(0, cat.length - 2)
    }
    return encodeURIComponent(cat)
  }

  function postNewComment(name, body, success, error) {
    $.ajax({
      method: 'POST',
      data: JSON.stringify({
        author: name,
        body: body
      }),
      contentType: 'application/json',
      url: host + '/post/' + currentURL(),
      success: success,
      error: error
    })
  }

  function onHtmlFetched(replace, html) {
    if (replace) {
      replaceWithInDom(html)
    } else {
      insertIntoDom(html)
    }

    var nameField = $('#talkbot-new-comment-name')
    var commentField = $('#talkbot-new-comment-body')
    var errorField = $('.talkbot-http-error')

    errorField.hide()

    if (localStorage.getItem('commenter-name')) {
      var name = nameField.val(localStorage.getItem('commenter-name'))
    }

    nameField.on('input', function(e) {
      localStorage.setItem('commenter-name', e.target.value)
    })

    $('#talkbot-new-comment-form').submit(function(e) {
      e.preventDefault()
      var name = nameField.val()
      var comment = commentField.val()
      postNewComment(name, comment, onHtmlFetched.bind(null, true), function(err) {
        errorField.slideDown()
      })
    })
  }

  $.ajax({
    method: 'GET',
    url: host + '/post/' + currentURL(),
    success: onHtmlFetched.bind(null, false),
    error: function(err) {
      console.error(err)
    }
  })
}
