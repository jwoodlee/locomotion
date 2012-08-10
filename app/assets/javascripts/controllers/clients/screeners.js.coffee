displayMatchingMembers = (query) ->
  $('#screenable_members_container').trigger('loading')
  $.ajax
    url:       $("#screener_polls_answer_filter_form").attr("action"),
    type:      "POST",
    data:      query,
    dataType:  'html',
    success:   (data) ->
      $('#screenable_members').html(data)
      count = $('#screener-pagination').data("approved-count")
      if count?
        $('#screener-approved-count').html(count)
      $('#screenable_members_container').trigger('loading-complete')

$(document).ready ->
  $(".screener_answer_sliders").each ->
    $(this).slider
      min:     0,
      max:     2,
      value:   2,
      change:  (event, ui) ->
        $('#' + $(this).data("input-id")).val(ui.value)

  $("#screener_member_filter_search").click (event) ->
    event.preventDefault()
    displayMatchingMembers($('#screener_polls_answer_filter_form').serialize() + '&' +  $('#screener_member_filter_form').serialize())

  $('#screenable_members_container').bind 'loading', ->
    $(this).spinner()

  $('#screenable_members_container').bind 'loading-complete', ->
    $(this).unspinner()

  $(document).delegate '#approve_all_members', 'change', ->
    $("#screenable_members input[type='checkbox']").each ->
      $(this).prop('checked', $("#approve_all_members").prop('checked'))

  $(document).delegate "#screenable_members input[type='checkbox']", 'change', ->
    if ( $(this).prop('checked') == false )
      $("#approve_all_members").prop('checked', false)

  $(document).delegate "#screener-pagination .pagination a", "ajax:beforeSend", ->
    $('#screenable_members_container').trigger 'loading'

  $(document).delegate "#screener-pagination .pagination a", "ajax:complete", (evt, xhr, status) ->
    $('#screenable_members').html xhr.responseText
    $('#screenable_members_container').trigger 'loading-complete'

  $(document).delegate "#moderator-member-screener-form", "ajax:beforeSend", ->
    $('#screenable_members_container').trigger 'loading'

  $(document).delegate "#moderator-member-screener-form", "ajax:complete", ->
    $('#screenable_members_container').trigger 'loading-complete'
    currentPage = $('#screener-pagination').data("current-page")
    currentPage ||= 1
    displayMatchingMembers $('#screener_polls_answer_filter_form').serialize() + '&' + $('#screener_member_filter_form').serialize() + "&page=" + currentPage
