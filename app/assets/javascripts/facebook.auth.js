jQuery(function($) {
  $('a[data-inline-signin="true"]').live('click', function(event) {
    var href   = $(this).attr('href');
    var width  = 900;
    var height = 675;

    var centerWidth  = ($(window).width() - width) / 2;
    var centerHeight = ($(window).height() - height) / 2;

    window.open(href, '_blank', 'width='+width+',height='+height+',left='+centerWidth+',top='+centerHeight+',scrollbars=1');

    event.preventDefault();
  });
});
