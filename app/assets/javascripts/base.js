// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

jQuery(function ($) {
  $('.brand-type select').change(function(){
    var $form = $($(this).parents('form')[0]);
    $form.spinner();
    $.ajax({
      data: $form.serialize(),
      url: $form.attr("action"),
      type: "POST",
      success: function() {
        $form.unspinner();
      }
    });
  });

  $(".attach-link a").click(function() {
    var wrapper = $(this).parents(".media-attachments-wrapper");
    wrapper.find(".attachment").show().parents(".member-response-input").resizeHack();
    return false;
  });

  var tipsyTooltipDefaultOptions = {
    title:   'tooltip-content',
    gravity: 'e',
    fade:    true
  };

  var applyTipsyTooltip = function() {
    $(".tipsyable").each(function(){
      var $element = $(this);

      var options = {};

      if($element.attr("tooltip-gravity")){
        options.gravity = $element.attr("tooltip-gravity")
      };

      if($element.attr("tooltip-element")){
        options.title = function(){
          return $("#" + $element.attr("tooltip-element")).clone().removeAttr("style").html();
        };
        options.html  = true;
      };

      $($element).tipsy($.extend({}, tipsyTooltipDefaultOptions, options));
    });
  }
  applyTipsyTooltip();

  $('.responses').each(function(){
    if($(this).is(':anchored')){
      $('.force-show').removeClass('force-show');
    }
  });

  $("body").slideForm();

  $('form:not([data-remote])').submit(function () {
    if ($(this).valid()) {
      $('button:submit, input:submit', this).attr('disabled', 'disabled');
    }
    return true;
  });

  $('.poll-options input:not(".hidden-checkbox"), .poll-options button:not(".multi-select-button"), .feedback_form button').live('click', function() {
    if ($(this).parents('form').valid()) {
      $(this).attr('disabled', 'disabled');
    }
    return true;
  });

  $(".click_and_select").click(function() {
    this.select();
  });

  $('.contact-us a, a.contact-us').click(function(){
    window.open('https://crowdtap.wufoo.com/forms/s7x3q7/',
                null,
                'height=784, width=680, toolbar=0, location=0, status=1, scrollbars=1, resizable=1');
    return false;
  });

  var watchScreenerPollQuestions = function(){
    $('#screener_poll .next-screener-question, .proceed-to-preactions').click(function() {
      if ($(this).hasClass('require-womma') && $('#womma') && $('#womma').prop('checked') === false) {
        return false;
      }

      $('#screener_poll').spinner();

      $.ajax({
        url: $(this).closest('form').attr('action'),
        dataType: 'html',
        success: function(html) {
          $('#screener_poll').html(html);
          watchScreenerPollQuestions();
          watchScreenerPollQuestionAnswering();
          $('#screener_poll').unspinner();
        }
      });

      return false;
    });
  };
  watchScreenerPollQuestions();

  if ($('#confirm_address').length) {
    $('.proceed-to-preactions').click(function() {
      $('#confirm_address').dialog('open');
      return false;
    });
  }

  var watchScreenerPollQuestionAnswering = function() {
    $('#screener-poll-participation-form button').click(function(event){
      $('#long_action_quick_hit_participation_poll_option_id').val( $(this).attr('data-poll-option-id') );
      var form = $(this).parents("form").first();
      $('#screener_poll').spinner();
      $.post(
        form.attr("action"),
        form.serialize(),
        function(html){
          $('#screener_poll').html(html);
          watchScreenerPollQuestions();
          watchScreenerPollQuestionAnswering();
          $('#screener_poll').unspinner();
        },
        "html"
      );
      return false;
    });
  };

  var updateBrandActionTargeting = function() {
    $.ajax({
      url: $(this).attr("action"),
      data: {
        brand_action: {
          available_for_advanced_targeting: $(this).find("input:checkbox").is(":checked")
        }
      },
      type: "PUT",
      dataType: 'json',
      success: function(data){
        $(this).find(":checkbox").prop('checked', data == "true");
      },
      failure: function(data){
        $(this).find(":checkbox").prop('checked', data == "true");
      }
    });
  };
  $('.brand_action_targeting_form').change(updateBrandActionTargeting);

  $('#facebook-connect-link').click( function() {
    $(this).spinner();
  });

  $('#facebook-lightbox').dialog({
    autoOpen:  false,
    modal:     true,
    resizable: false,
    draggable: false,
    title:     'Sign up'
  });

  $('.sign-in-with-facebook:not([data-inline-signin="true"])').click(function(event) {
    $('#facebook-lightbox').dialog('open');
    event.preventDefault();
  });

  $("a[data-close]").click(function() {
    window.close();
  });

  $("a.open-facebook-share").live("click", function(){
    window.open($(this).attr('href'), 'fb-share-window', 'height=400,width=500');
    return false;
  });

  $("a.disabled").click(function() {
    return false;
  });

  $('.dialog-button, .dialog-button-other').live('click', function () {
    var dialogElementId = '#' + $(this).attr('data-dialog');
    var title = $(this).attr('data-dialog-title');
    var closeDialog = function () {
      $(dialogElementId).dialog('close');
      return false;
    };
    $(dialogElementId).
      dialog({ modal: true, title: title }).
        find('button.cancel').
          click(closeDialog);
    return false;
  });

  var toggleWrapper = (function() {
    return {
      init : function() {
        $(".toggle-wrapper").live("click", function() {
          var $toggle  = $(this);
          var url      = $toggle.data("url");
          var $wrapper = $($toggle.data("target"));

          $wrapper.spinner();

          $.ajax({
            type:    "GET",
            url:     url,
            dataType: "html",
            data:    $(this).closest('form').serialize(),
            success: function(data) {
              $wrapper.html(data);
              $wrapper.unspinner();
              $toggle.trigger("loading-complete");
              removeTemporarySpinners();
              $wrapper.slideForm();
              ajaxPagination.init();
            }
          });
        });
      }
    };
  }());
  toggleWrapper.init();

  var ajaxPagination = (function() {
    var pageLinkSelector = ".ajax-pagination .pagination a";

    var makePaginationLinksRemote = function($element) {
      if (!$element) $element = $("body");
      $element.find(pageLinkSelector).attr("data-remote", "true").attr("data-type", "html").addClass("page");
    };

    var handledLinks = false;
    var handlePageLinks = function() {
      if (handledLinks) return;
      handledLinks = true;

      $(pageLinkSelector).live("ajax:before", function() {
        $(this).closest(".ajax-pagination").spinner();
      });

      $(pageLinkSelector).live("ajax:success", function(object, response) {
        var newContent = $(this).closest(".ajax-pagination").unspinner().html(response).slideForm();
        $(".ajax-pagination").trigger("loading-complete");
        makePaginationLinksRemote(newContent);
      });
    };

    return {
      init: function() {
        makePaginationLinksRemote();
        handlePageLinks();
      }
    };
  })();
  ajaxPagination.init();

  var bindAddressForm = function() {
    $address_wrapper = $("#confirm_address");
    $form =  $address_wrapper.find("form");

    $address_wrapper.dialog({
      modal: true,
      width: 460,
      closeOnEscape: false,
      autoOpen: false,
      open: function(event, ui) { $(".ui-dialog-titlebar-close").hide(); }
    });

    $form.live("ajax:error", function() {
      $("#confirm_address").find(".error").remove();
      var error_div = $("<div class='error'>Address invalid.</div>");
      $("#confirm_address").prepend(error_div);
      $form.find("button").removeAttr("disabled");
      return false;
    });

    $form.live("ajax:complete", function() {
      $address_wrapper.unspinner();
    });

    $form.live("ajax:before", function() {
      $address_wrapper.spinner();
    });

    $("#confirm_address form").live("ajax:success", function() {
      var address = $form.find("#member_address1").val() + ", ";
      if($form.find("#member_address2").val()) {
        address += $form.find("#member_address2").val() + ", ";
      }
      address += $form.find("#member_city").val() + ", ";
      address += $form.find("#member_state").val() + " ";
      address += $form.find("#member_address_zip_code").val();
      $("#ship_to_address").text(address);
      $("#confirm_address").remove();
      return false;
    });
  };
  bindAddressForm();

  var rebinder = function() {
    var elementsToRebind = [];
    return {
      rebind: function() {
        $.each(elementsToRebind, function() {
          this();
        });
      },
      remember: function(funcToRebind) {
        elementsToRebind[elementsToRebind.length] = funcToRebind;
      }
    };
  }();

  $("li.pricing_package_subscription_information").equalHeights();

  $('.toggle-link').live('click', function() {
    var nextText = $(this).data('toggle-text');
    $(this).data('toggle-text', $(this).text());
    $(this).text(nextText);
    $($(this).data('toggle-target')).toggle();
    return false;
  });

  $(".form-submitter").click(function() {
    $(this).parents("form").submit();
  });

  $("#member-filter").live("submit", function() {
    var $form        = $(this);
    var $results     = $("#poll-results");
    var $respondents = $("#participated-members");
    var params       = $form.serialize();

    $results.spinner();
    $respondents.spinner();

    $.get($respondents.data('url'), params, function(response) {
      $respondents.unspinner().html(response);
    }, 'html');

    $.get($form.attr('action'), params, function(response) {
      $results.unspinner().html(response);
    }, 'html');

    $("#member-filter-submit-button").removeAttr("disabled");

    return false;
  });

  $(".instant-dialog-without-close").dialog({
    modal: true,
    open: function(event, ui) { $(".ui-dialog-titlebar").remove(); },
    closeOnEscape: false,
    dialogClass: 'onboarding-modal',
    width: '720px'
  });

  // Animate Bars
  $(".progress").each(function() {
    var $fill        = $(this).find(".fill");;
    var finalWidth   = $fill.width();
    var currentWidth = 0;

    var fill = function() {
      currentWidth += 6;
      if(currentWidth > finalWidth){
        currentWidth = finalWidth;
      };
      $fill.animate({ width: currentWidth }, 20);
      if(currentWidth < finalWidth){
        setTimeout(fill, 20);
      };
    };
    fill();
  });

  $("#web-share-link").live("click", function() {
    $("#thumbs-up-submit, #thumbs-down-submit").removeAttr('disabled');
    var reopenLink = $(this).clone().attr("id", "re-open-link").html("re-open");
    $(this).addClass('disabled').after(reopenLink);
    $(this).unbind("click").bind("click", function() { return false; });
  });

  $("#close-quickhit-prompt").live('click', function(){
    $("#quick-hit-help-text").remove(); //Old brand page
    $("#next-action").show(); //Old brand page
    $("#quick-hit-lightbox #quick-hit-help-text").remove();
    $("#quick-hit-lightbox #next-action").show();
    return false;
  });

  var applyTimeago = function() { $('time').timeago(); }
  applyTimeago();

  // function that need to be called also on asynchronously loaded element should be placed below.
  $(document).on('ajaxComplete',
                 function () {
                   applyTimeago();
                   applyTipsyTooltip();
                 });

  $('.page-appender a.more').live('click', function() {
    var $_link    = $(this);
    var $_wrapper = $_link.hide().parents('.pager-wrapper');

    $_wrapper.height("50px").spinner();

    $.get($_link.attr("href"), function(_response) {
      $_link.parents('.page-appender').append(_response);
      $_wrapper.unspinner().remove();
    },'html');
    return false;
  });

  (function() {
    var preloads = [];

    $('.lazy-load').each(function() {
      var $div = $(this).spinner();

      var loader = function(){
                    $div.load(
                      $div.data('url'),
                      function(){
                        $div.unspinner();
                      }
                    );
                  };

      if ( $div.hasClass("priority") ){
        preloads.unshift(loader);
      } else {
        preloads.push(loader);
      }
    });

    $.each(preloads, function(index, element){
      setTimeout(element, index * 100);
    });

  })();

});

// TODO: Refactor all items below this into the appropriate areas

function enableLaunchIfLaunchable(launchable){
  if(launchable){
    var launchButtons = $.find("input[type='submit'][value='Launch Action']");
    for(var i = 0; i < launchButtons.length; i++) {
      launchButtons[i].disabled = false;
    }
  }
}

var removeTemporarySpinners = function() {
  $(".temporarySpinner").removeClass("loading temporarySpinner");
};
$(removeTemporarySpinners);

var instantDialog = function(){
  $(".instant-dialog").dialog({
    modal: true,
    width: 760,
    dialogClass: "noTitleBar",
    close: function(event, ui) {
      $(this).remove();
    }
  });
};
$(instantDialog);

function asynchronouslyLoadActivityFeed(activityFeedUrl) {
  $('#activity-feed-content').spinner();
  $.get(activityFeedUrl,
    function(html) {
      $("#activity-feed-content").html(html);
      $("#activity-feed abbr.timeago").timeago().removeAttr('title');
      $('#activity-feed-content').unspinner();
    },
    'html'
  );
}

var incrementAnimator = (function() {
  var self = {};
  self.init = function() {
    var currentCash = $("#current-award");
    var currentPoints = $("#current-points");
    if(currentCash.length) $(".cash .current .amount").first().animateLastMonetaryReward(currentCash.text());
    if(currentPoints.length) $(".points-cash .points .number").first().animateLastPointAward(currentPoints.text());
  };

  self.delay = function(func, timeout) { setTimeout(func, timeout); };

  String.prototype.toInteger = function() {
    return parseInt(this.replace(/[^0-9]/g, ""), 10);
  };

  return self;
})();
$(incrementAnimator.init);


$(document).ajaxSend(function(e, xhr, options) {
  var token = $("meta[name='csrf-token']").attr("content");
  xhr.setRequestHeader("X-CSRF-Token", token);
});
