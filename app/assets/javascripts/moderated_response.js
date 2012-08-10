var page = {};
var currentUser = {};

var moderatedResponse = function(){
  var self = {};

  self.prepare_liking = function(){
    $(".moderated-response-data").each(function(){
      _set_wrapper(this);
      var _able_to_like = $(this).attr('data-member-able-to-like');
      _hide_show_likers();
      if (_able_to_like == 'true'){ _enable_liking() };
    })
    return self;
  };

  // liking and all it's functions
  self.like = function(_form){
    _set_wrapper(_form);
    var $_form = $(_form);

    _disable_liking();
    _change_likes_count_by(1);
    _add_liker();
    _hide_show_likers();
    _remove_like_error();

    $.ajax({
      url: $_form.attr('action'),
      data: $_form.serialize(),
      type: "POST",
      dataType: 'html',
      success: function(){
        _brighten_liker();
      },
      error: function(){
        _change_likes_count_by(-1);
        _hide_show_likers();
        _remove_liker();
        _enable_liking();
        _show_like_error();
      }
    });

    return self;
  };

  // commenting and all of it's function
  self.comment = function(_form){
    _set_wrapper(_form);
    var $_form = $(_form);
    $_form.hide();
    var $_new_comment = page.moderated_comment_template.clone(false);
    var $_textarea    = $_form.find("textarea");

    $_new_comment.find(".comment-body p").last().html($_textarea.val());

    $_new_comment.addClass('dimmed');
    $_wrapper.find(".comments_container .shown-comments").append($_new_comment);

    $.ajax({
      url: $_form.attr('action'),
      data: $_form.serialize(),
      type: "POST",
      dataType: 'html',
      success: function(){
        $_new_comment.removeClass('dimmed');
        self.reset_form(_form);
        if(currentUser.member){
          $('body').trigger("actionTaken");
        };
      },
      error: function(_response){
        $_new_comment.remove();
        _show_error(_form, _response.responseText);
      },
      complete: function(){
        $_form.find("input[type='submit']").removeAttr("disabled");
        $_form.show().blur();
      }
    });

    return self;
  };

  self.reset_form = function(_form){
    var $_textarea    = $(_form).find("textarea");
    $_textarea.val($_textarea.attr('placeholder'));
    _hide_error(_form);
    return self;
  };

  function _set_wrapper(element){
    $_wrapper = $(element).closest(".response-actions")

    if($_wrapper.length == 0){
       $_wrapper = $(element).find(".response-actions");
    }
  }

  function _hide_show_likers(){
    var $_likes_wrapper = $_wrapper.find('.likes-wrapper');

    if(parseInt($_wrapper.find(".like-count").html()) > 0){
      $_likes_wrapper.show();
    }else{
      $_likes_wrapper.hide();
    }
  };

  function _change_likes_count_by(_value){
    var $_element = $_wrapper.find(".like-count");
    $_element.html(parseInt($_element.html()) + parseInt(_value));
  };

  function _disable_liking(){
    $_wrapper.find(".like-link-wrapper").hide();
    $_wrapper.find(".like-link-wrapper button")
      .addClass('disabled')
      .attr('disabled', 'disabled');
    $_wrapper.find(".likes-wrapper button")
      .addClass('disabled')
      .attr('disabled', 'disabled');
  };

  function _enable_liking(){
    $_wrapper.find(".likes-wrapper button")
      .removeClass('disabled')
      .removeAttr('disabled');
    $_wrapper.find(".like-link-wrapper button")
      .removeClass('disabled')
      .removeAttr('disabled');
    $_wrapper.find(".like-link-wrapper").show();
  };

  function _add_liker(){
    var $_user_photo = $(currentUser.tiny_photo).clone();
    $_user_photo.addClass('dimmed');
    $_wrapper.find(".photo-wrapper").append($_user_photo);
  };

  function _brighten_liker(){
    $_wrapper.find(".photo-wrapper a").last().removeClass('dimmed');
  };

  function _remove_liker(){
    $_wrapper.find(".photo-wrapper a").last().remove();
  };

  function _show_like_error(){
    $_wrapper.find(".like-link-wrapper").append(page.ajax_error);
  };

  function _remove_like_error(){
    $_wrapper.find(".like-link-wrapper img").remove();
  };

  function _hide_error(_form){
    var $_form = $(_form);
    $_form.find(".error").hide();
    $_form.find(".inline-errors").hide().html('');
  };

  function _show_error(_form, _error_message){
    var $_form = $(_form);
    $_form.find(".error").show();
    $_form.find(".inline-errors").show().html(_error_message);
  };

  return self;
}();
