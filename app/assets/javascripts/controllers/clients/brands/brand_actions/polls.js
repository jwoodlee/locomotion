$(function () {
  var addPollAnswer = function() {
    var formId = "#" + $(this).parents("form:first").attr("id"),
        optionCount = $(formId + ' li.option').length,
        li = $(formId + ' li.option').eq(0).clone(),
        answer_input_id = 'option_' + optionCount,
        answer_input_name = 'brand_action[poll_options_attributes][' + optionCount + '][value]';

    li.find('label:first').attr('for', answer_input_id).text("Answer " + (optionCount + 1));
    li.find("input[type='text']:first").attr({ 'id' : answer_input_id, 'name' : answer_input_name }).val("");
    $(formId + ' li.option:last').after(li);
    $(formId + ' #' + answer_input_id).prefilledInput();

    return false;
  }

  $('.poll-options-form .add-poll-answer').click(addPollAnswer);
});
