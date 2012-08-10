jQuery(function($) {
  var valid = function() {
    var validForm = true;

    $('[data-validates-presence=true]', $('form.validatable')).each(function() {
      if ($(this).is('input[type="checkbox"]:not(:checked)')) {
        validForm = false;
      } else if ($(this).val() == '') {
        validForm = false;
      }
    });

    return validForm;
  };

  var validate = function() {
    if (valid()) {
      $submitButtons.enable();
    } else {
      $submitButtons.disable();
    }
  };

  var $submitButtons = $('button[type="submit"]', 'form.validatable');
  $submitButtons.disable();

  $('*', 'form.validatable').change(validate);

  $('form.validatable').submit(function(event) {
    if (!valid()) {
      event.preventDefault();
      return false;
    }
  });

  validate();
});
