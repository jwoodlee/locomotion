$(function() {
  $("#brand-action-feed-items-section").each(function(){
    var keepFetching = true;

    var fetch = function(page){
      var url = $("#brand-action-feed-items-section").data("url");
      $.get(url, { page: page })
        .complete(function(data){
          $('#ajax-loader').before(data.responseText);
          if (data.responseText == " ") {
            keepFetching = false;
            $('#ajax-loader').remove();
          }
        });
    };

    $(document).endlessScroll({
      fireOnce: true,
      ceaseFire: function() { return !keepFetching; },
      callback: function(page) { fetch(page + 1) }
    });

    fetch(1);
  });

  $("#welcome-modal").each(function(){
    $(this).dialog({
      modal: true,
      width: 485,
      height: "auto",
      draggable: false,
      resizable: false,
      dialogClass: "noTitleBar",
      position: "top"
    });
  });

  $('#welcome-modal-form')
    .bind('ajax:beforeSend', function(){
      $("#welcome-modal").dialog('close');
    })

  $('#welcome-modal-social-media-post-form')
    .bind('ajax:success', function(){
      Flash.success("Successfully posted to Facebook");
    })
    .bind('ajax:error', function(){
      Flash.failure("Something went wrong while trying to post to Facebook.");
    });

  $('#welcome-modal-start-tappin-button').click(function(event){
    event.preventDefault();
    $('#welcome-modal-form').submit();
    if ($("#welcome-modal-social-media-post-form input[type=checkbox]").is(':checked')) {
      $("#welcome-modal-social-media-post-form").submit();
    }
  });

  $('#vip-scrollbar').tinyscrollbar();
});
