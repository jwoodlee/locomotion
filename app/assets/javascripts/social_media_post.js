var SocialMediaPost = function(){
  var private = {};
  var public  = {};

  private.identifier = "";

  private.form = function(){
    return $(private.identifier);
  };

  private.container = function(){
    return private.form().parent(".social-media-post-container");
  };

  private.success = function(){
    $("#flash_success").show();
  };

  private.failure = function(){
    $("#flash_failure").show();
  };

  private.hide_messages = function(){
    $("#flash_failure").hide();
    $("#flash_success").hide();
    $("#platforms-error-message").hide();
    $("#message-error-message").hide();
  };

  private.validate = function(){
    var _should_post = true;

    var $_checkboxes = private.container().find(".share_socially:checked");
    if( $_checkboxes.length == 0){
      _should_post = false;
      private.container().find("#platforms-error-message").show();
    }else{
      private.container().find("#platforms-error-message").hide();
    }

    var $_message_container   = private.container().find("#social_media_post_message");
    var $_message             = $.trim( $_message_container.val() );
    var $_message_placeholder = $.trim( $_message_container.attr("placeholder") );

    if( $_message.length == 0 || $_message == $_message_placeholder ) {
      _should_post = false;
      private.container().find("#message-error-message").show();
    }else{
      private.container().find("#message-error-message").hide();
    }
    return _should_post;
  };

  public.can_post = function(_identifier){
    private.hide_messages();
    private.identifier = _identifier;
    return private.validate();
  };

  public.post = function(_identifier){
    private.identifier = _identifier;

    $_form = private.form();
    $_form.spinner();

    $.ajax({
      url:      $_form.attr("action"),
      type:     "POST",
      async:    true,
      data:     $_form.serialize(),
      dataType: 'html',
      success:  function(){
        private.success();
      },
      error: function(){
        private.failure();
      },
      complete: function(){
        $_form.unspinner();
      }
    });
    return public;
  }
  return public;
}();
