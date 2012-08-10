(function ($) {
  $('a.flag').live('click', function () {
    $('form.flag').hide();
    $('a.flag').show();
    $('#' + this.id.replace('-link', '')).show();
    return false;
  });

  $('a.flagged').live('click', function () {
    $('#' + this.id.replace('-cancel', '-link')).show();
    $('#' + this.id.replace('-cancel', '')).hide();
    return false;
  });

  $('form.flag').hide();
})(jQuery);

$(function() {
  $('form.bookmark, form.bookmarked').live('submit', function(event){
    var data = $(this).serialize();
    var url  = $(this).attr('action');
    var form = event.target;
    $(this).hide();
    var moderateable = $(this).parents(".moderateable").first();
    moderateable.trigger('loading');
    $.ajax({
      type:     'POST',
      url:      url,
      data:     data,
      dataType: 'json',
      success:  function(response){
        $("#toggle-bookmarked-responses-wrapper").fadeIn('fast');
        moderateable.trigger('loading-complete');
        $(form).replaceWith(response.form);
      }
    });
    return(false);
  });

  $('form.star, form.starred').live('submit', function(event){
    var data = $(this).serialize();
    var url  = $(this).attr('action');
    var form = event.target;
    $(this).hide();
    var moderateable = $(this).parents(".moderateable").first();
    moderateable.trigger('loading');
    $.ajax({
      type:     'POST',
      url:      url,
      data:     data,
      dataType: 'json',
      success:  function(response){
        $("#toggle-starred-responses-wrapper").fadeIn('fast');
        moderateable.trigger('loading-complete');
        $(form).replaceWith(response.form);
      }
    });
    return(false);
  });

  $('form.flag').live('submit', function(){
    var data = $(this).serialize();
    var url  = this.action;
    $(this).hide();
    var moderateable = $(this).parents(".moderateable").first();
    moderateable.trigger('loading');
    $.ajax({
      type:     'POST',
      url:      url,
      data:     data,
      dataType: 'json',
      success:  function(response){
        if (response.success){
          $(moderateable).slideUp('fast', function() {
            $(moderateable).remove();
          });
        }
        moderateable.trigger('loading-complete');
      }
    });
    return(false);
  });
});
