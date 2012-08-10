jQuery(function($) {
  var $form = $('form.validatable');

  $form.bind('submit', function(event) {
    $form.spinner();
  });
});
