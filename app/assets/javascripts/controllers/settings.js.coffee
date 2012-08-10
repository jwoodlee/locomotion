$('form#code-request').bind "ajax:before", ->
  $(this).spinner()
.bind "ajax:success", (event, data) ->
  $("#code-request .messages").html $("<div class='success'>" + data.text + "</div>")
.bind "ajax:error", (event, xhr) ->
  errors = $.parseJSON(xhr.responseText).verification_phone_number
  el = $("<div class='error'> Verification phone number " + errors.join(", Verification phone number ") + "</div>")
  $("#code-request .messages").html(el)
.bind "ajax:complete", ->
  $(this).unspinner()

$('form#code-verification').bind "ajax:before", ->
  $(this).spinner()
.bind "ajax:success", (event, data) ->
  $("#phone-verification").html($("<div class='verified'>" + data.text + "</div>"))
.bind "ajax:error", (event, xhr) ->
  response_text = $.parseJSON(xhr.responseText).text
  el = $("<div class='error'>" + response_text + "</div>")
  $("#code-verification .messages").html(el)
.bind "ajax:complete", ->
  $(this).unspinner()

selectTab = (tab_id) ->
  $("#edit-member-page ul.cs-nav-tabs li").each ->
    $($(this).find("a[data-target-tab]").data('target-tab')).hide()
    $(this).removeClass('active')
  $(tab_id).show()
  $("#edit-member-page a[data-target-tab='#{tab_id}']").parent().addClass('active')

$("#edit-member-page a[data-target-tab]").click (event) ->
  event.preventDefault()
  selectTab($(this).data('target-tab'))

selectTab $("#edit-member-page").data('target-tab') || $("#edit-member-page ul.cs-nav-tabs li a").first().data('target-tab')
