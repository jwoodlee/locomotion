$.extend $.gritter.options, position: 'bottom-left', fade_in_speed: 300, fade_out_speed: 1000, time: 10000

notificationOptions =
  LevelAward: ((award) ->
    text:       "Congratulations! You are now #{ award.level } #{ award.tracking_pixel }",
    class_name: 'level-growl',
    title:      'You leveled up!' ),
  StarAward: ((award) ->
    text:       "You earned #{ award.stars } star#{ if (award.stars > 1) then 's' else '' } for #{ award.reason }",
    class_name: 'stars-growl',
    title:      'You just earned a star!' ),
  Flag: ((award) ->
    text:       "You were flagged for being #{ award.reason }",
    class_name: 'flag-growl',
    title:      'Uh oh, you got flagged' ),
  Unflag: ((award) ->
    text:       "A flag was removed from your account! The flag was for being #{ award.reason }",
    class_name: 'unflag-growl',
    title:      'Yay, you got unflagged' ),
  Award: ((award) ->
    text:       "You got #{ award.points } points for #{ award.reason } #{ if award.brand_action_title? then award.brand_action_title else '' }",
    class_name: 'points-growl',
    title:      'You just got points!' ),
  ShameAward: ((award) ->
    text:       "You were deducted #{ -award.points } points for #{ award.reason } #{ if award.brand_action_title? then award.brand_action_title else '' }",
    class_name: 'shame-growl',
    title:      'Uh oh, you lost points' ),
  MissionAward: ((award) ->
    template = $('#big-notification-templates .mission-award-template').clone()
    template.find('.mission-image').attr('src', award.badge_image_url)
    template.find('.mission-name').html(award.mission_name)
    template),
  FirstStarAward: ((award) ->
    template = $('#big-notification-templates .first-star-award-template').clone()
    template.find('.first-star-award-reason').html(award.reason)
    template),
  BigLevelAward: ((award) ->
    template = $('#big-notification-templates .level-award-template').clone()
    template.find('.award-level-name').html(award.level)
    template.find('.award.level-award').addClass(award.level_class + '-level-award')
    if award.level_message?
      template.find('.big-notification-content-text').html(award.level_message)
    template.append(award.tracking_pixel)
    template),
  TopAward: ((award) ->
    template = $('#big-notification-templates .top-award-template').clone()
    template.find('.brand-action-humanized-name').html(award.humanized_brand_action_name)
    template.find('.brand-action-title').html(award.brand_action_title)
    template)

displayGritter = (award, index) ->
  setTimeout ( ->
    $.gritter.add( notificationOptions[award.type](award) ) ), $.constants.notificationDisplayInterval * index

bigNotificationBuffer = []

queueBigNotification = (award) ->
  content = notificationOptions[award.type](award)
  content.find('a[data-show-next-big-notification]').click (event) ->
    event.preventDefault()
    $(content).dialog('close')
    $('body').trigger('showNextBigNotification')
  bigNotificationBuffer.push( ->
    $(content).dialog({ modal: true, width: 675, dialogClass: 'noTitleBar big-notification-modal' }))

notificationDisplayFunction =
  Award:          displayGritter,
  BigLevelAward:  queueBigNotification,
  FirstStarAward: queueBigNotification,
  Flag:           displayGritter,
  LevelAward:     displayGritter,
  MissionAward:   queueBigNotification,
  ShameAward:     displayGritter,
  StarAward:      displayGritter,
  TopAward:       queueBigNotification,
  Unflag:         displayGritter

$(document).ready ->

  $("body").bind 'showNextBigNotification', ->
    nextBigNotification = bigNotificationBuffer.shift()
    if nextBigNotification?
      nextBigNotification()

  $("body").bind 'getNotifications', ->
    $.getJSON "/api/v1/awards", (awards) ->
      $.each awards, (index, award) ->
        notificationDisplayFunction[award.type](award, index)
      $('body').trigger('showNextBigNotification')

  $("body").bind "actionTaken", ->
    $('body').trigger('getNotifications')
    $.get("/nameplate", (data) ->
      $(".top-member-info").html(data)
    ,"html")

  id = $('div[data-member-id]').data('member-id')
  if id? && id != ''
    $('body').trigger('getNotifications')
