$(document).ready ->
  $("body").delegate '#responses-container .bottom a', 'ajax:beforeSend', (event) ->
    $.scrollTo ".top", $.constants.transitionTimeout
