$(function() {
  var addStep = function() {
    var optionCount = $('li.option').length;
    var li = $('li.option').eq(0).clone();
    var step_input_id = 'step_' + optionCount;
    var step_input_name = 'brand_action[challenge_response_steps_attributes][' + optionCount + '][direction]';
    li.find('label:first').attr('for', step_input_id).text("Step " + (optionCount + 1));
    li.find("input[type='text']:first").attr({ 'id' : step_input_id, 'name' : step_input_name }).val("");
    $('li.option:last').after(li);
    $('#' + step_input_id).prefilledInput();

    return false;
  };

  $("#add-step").click(addStep);

  $("#brand_action_award_excellent_response").change(function(){
    var pointsForExcellentResponse  = $("#brand_action_points_for_excellent_response");
    var excellentResponseDefinition = $("#brand_action_excellent_response_definition");
    var excellentRequirements       = $("#brand_action_excellent_requirements_for_humanoid");

    if ($(this).is(":checked")) {
      pointsForExcellentResponse.enable();
      excellentResponseDefinition.enable();
      excellentRequirements.enable();
    } else {
      pointsForExcellentResponse.disable();
      excellentResponseDefinition.disable();
      excellentRequirements.disable();
    }
  });
});
