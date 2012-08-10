$(function() {
  var applyCheckbox = function() {
    var inputField = $(this).siblings().find('input.unlimited-input');

    if ($(this).prop('checked')) {
      inputField.val('Unlimited');
      inputField.disable();
    } else {
      inputField.enable();
      inputField.val('');
    }
  };

  var quotaCountCheckbox = $('input[type="checkbox"].unlimited');
  quotaCountCheckbox.click(applyCheckbox);
  quotaCountCheckbox.filter(':checked').each(applyCheckbox);
});
