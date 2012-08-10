# This file is only included when running in the test environment
$.constants.notificationDisplayInterval = 0

$.fx.off = true
$.ajaxSetup(async: false)
incrementAnimator.delay = (f) ->
  f()

# gritter notification hijacking:
#
# $.gritter.add appends the title/text in a cookie
#
# XXX the cookies max size is 4K, so we might loose some notifications, but
# that should be fine since the user should not be flooded with notifications.
#
$.gritter.__add = $.gritter.add
$.gritter.add = (args...) ->
  $.gritter.__add.apply(null, args)
  history = $.cookie('gritter') || ""
  new_entry = "#{args[0].title}: #{args[0].text}\n"
  $.cookie('gritter', history + new_entry, {path: '/'})
$.gritter.history_contains = (str) ->
  $.cookie('gritter').indexOf(str) != -1

$.awards_api_calls_count = 0
$('body').bind 'getNotifications', ->
  $.awards_api_calls_count = $.awards_api_calls_count + 1
