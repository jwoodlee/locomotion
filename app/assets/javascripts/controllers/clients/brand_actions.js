$(function() {
  $('form.ready_to_launch input[type="submit"]').click(function(event) {
    var $form = $(this).parents("form");
    $form.spinner();
    $.ajax({
      type: 'POST',
      url: $form.attr('action'),
      dataType: 'html',
      success: function() {
        $form.hide();
        $("#pending-launch").show();
      },
      complete: function(data) {
        $form.unspinner();
      }
    });
    return false;
  });
});
