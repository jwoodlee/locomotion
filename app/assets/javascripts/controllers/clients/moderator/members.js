$(function(){
  $('table#search-results form[data-remote][id*=edit_member]')
    .bind('ajax:beforeSend', function(){
      $('#' + $(this).attr('data-status-id'))
        .removeClass('response-error')
          .addClass('small-spinner');
    })
    .bind('ajax:success', function(){
      $('#' + $(this).attr('data-container-id')).remove();
      $('.tipsy').remove();
    })
    .bind('ajax:error', function(){
      $('#' + $(this).attr('data-status-id'))
        .removeClass('small-spinner')
          .addClass('response-error');
    });

  $('a.open_reward_modal').click(function(e) {
    e.preventDefault();

    var modal = $($(this).attr('data-modal-target'));

    modal.dialog({
      modal: true,
      width: 500,
      resizeable: false,
      title: "Reward Member"
    });
  });

  var $form = $(".member_rewards_modal form");

  $form.bind('ajax:before', function() {
    $('.member_rewards_modal').spinner();
  });

  $form.bind("ajax:success", function(evnt, data) {
    var $current_levels = $form.siblings('.current_levels');
    var $cash = $current_levels.find('.cash');
    var $points = $current_levels.find('.points');
    var _json = data;

    if (_json.hasOwnProperty('cash')) {
      $cash.html(_json.cash);
      $cash.effect('highlight');
    }

    if (_json.hasOwnProperty('points')) {
      $points.html(_json.points);
      $points.effect('highlight');
    }

    $form.find("#award_cash, #award_points").val("");
  });

  $form.bind("ajax:complete", function(evnt, data, status, xhr) {
    var $form = $(this);
    var $response_message = $form.siblings('.response_message');
    var _json = $.parseJSON(data.responseText);

    $('.member_rewards_modal').unspinner();

    $response_message.html(_json.message);
    $response_message.effect('highlight');

    return true;
  });
});
