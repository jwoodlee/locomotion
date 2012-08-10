// This file provides jQuery extensions that are used in multiple places across the system
// If you aren't using a function more than once, it does not belong here.
//
// If you aren't using the function in multiple files, think long and hard if it really belongs here.
//
// jQuery Extensions ---------
(function($) {

  $.ajaxSettings.dataType = "json";

  $.constants = {
    notificationDisplayInterval: 500,
    awardsTimeout:     10000,
    pointsTimeout:     5000,
    pollingTimeout:    1000,
    transitionTimeout: 800
  };

  $.extend($.expr[':'], {
    anchored: function (el) {
      var anchor = window.location.hash;
      return anchor && $(el).is(anchor + ", :has(" + anchor + ")");
    }
  });

  $.fn.resizeHack = function() {
    if (!jQuery.browser.msie) return;
    $(this).hide().show();
  };

  $.moneyFormat = function(amount) { return "$" + parseFloat(amount).toFixed(2); };

  $.formatCurrency = function(numstr) {
    var numerics, sign, dollars, cents, prettyDollars;

    numerics = numstr.toString().replace(/[^-\d\.]/g,'');
    if (isNaN(numerics)) {
      numerics = "0";
    }

    // Parse into parts
    dollars = Math.floor(Math.abs(numerics));
    cents   = (numerics - dollars).toFixed(2).split('.')[1]; // Extract just the cents value

    sign = "";
    if (numerics < 0) {
      sign = "-";
    }
    dollars = Math.abs(dollars).toString();

    // Add commas to group thousands
    prettyDollars = "";
    for (var i = dollars.length - 1; i >= 0; i--) {
      var leftmostDigit = dollars[i];

      var currentDigitPlace = dollars.length - i - 1;
      if (currentDigitPlace % 3 == 0 && currentDigitPlace !== 0) {
        leftmostDigit += ",";
      }
      prettyDollars = leftmostDigit + prettyDollars;
    }

    return (sign + '$' + prettyDollars + '.' + cents);
  };

  $.fn.enableForm = function() {
    $('button:submit, input:submit', this).removeAttr('disabled');
  };

  $.fn.enable = function() {
    $(this).removeAttr('disabled');
  };

  $.fn.disable = function() {
    $(this).attr('disabled', 'disabled');
  };

  var justOnce = function($item, functionName) {
    if ($item.data("hasSlide")) { return; }
    $item[functionName]();
    $item.data("hasSlide", true);
  };

  $.fn.slideForm = function() {
    $(this).find('input.reveal').each(function () {
      justOnce($(this), "setupFormReplace");
      return $(this);
    });

    $(this).find('.reveal-button').each(function () {
      justOnce($(this), "setupFormToggle");
      return $(this);
    });

    $(this).find('.toggle-button').each(function () {
      justOnce($(this), "setupDataToggle");
      return $(this);
    });
  };

  $.fn.chopLength = function(maxLength){
    return this.live('keyup', function(){
      if(this.value.length >= maxLength){
        this.value = this.value.substring(0, maxLength);
      }
    });
  };

  $.fn.characterCount = function(maxLength){
    var characterDisplayClass = $(this).attr('id') + '_character_count';
    var countContainer        = $('<div class="character-count"> characters remaining</div>');
    var characterDisplaySpan  = $('<span>').addClass(characterDisplayClass).html(maxLength - $(this).val().length);
    $(this).after(countContainer.prepend(characterDisplaySpan));
    return this.live("keyup blur", function() {
      var charactersRemaining = 0;
      if ($(this).attr('placeholder') === $(this).val()) {
        charactersRemaining = maxLength;
      } else {
        charactersRemaining = maxLength - $(this).val().length;
      }
      $('.'+characterDisplayClass).html(charactersRemaining);
    });
  };

  $.fn.stopType = function(maxLength){
    return this.live('keydown', function(e){
      if(this.value.length >= maxLength) {
        if(e.which >= keyboard["0"] && e.which != keyboard["Delete"]) {
          return false;
        }
      }
    });
  };

  $.fn.chopAt = function(length) {
    $(this).
      chopLength(length).
      stopType(length).
      stopRepeat(length).
      characterCount(length);
  };

  $.fn.setupFormReplace = function() {
    $input = $(this);
    var $tohide = $input;
    if ($input.attr("data-hide")) { $tohide = $input.closest($input.attr("data-hide")); }
    $input.replaceElement("show", function($element) {
      $tohide.hide();
      $cancelButton = $element.find(".hide-button");
      $element.find("textarea").trigger("focus").focus();
      $cancelButton.click(function() {
        $element.hide();
        $tohide.show();
        return false;
      });
    });
  };

  $.fn.setupDataToggle = function(){
    $(this).replaceElement("slideToggle");
  };

  $.fn.replaceElement = function(animationFunctionName, callback) {
    var $toggle = $($(this).attr('data-toggle'));
    var swapAltText = function (swap_element) {
      var altText = $(swap_element).attr('data-alt-text');

      if (altText) {
        $(swap_element).attr('data-alt-text', $(swap_element).text());
        $(swap_element).text(altText);
      }
    };

    if ($toggle.is(':anchored') || $toggle.hasClass('force-show')) {
      $toggle.show();
      swapAltText(this);
    } else {
      $toggle.hide();
    }

    $(this).click(function () {
      swapAltText(this);
      $toggle[animationFunctionName]();
      if (callback) callback($toggle);
      return false;
    });
  };

  $.fn.setupFormToggle = function(){
    var to_reveal = $(this).attr('data-reveal');
    var to_hide   = $(this).attr('data-hide');

    $(to_reveal).hide();

    $(this).click(function () {
      $(to_reveal).slideToggle();
      $(to_hide).toggle();
      return false;
    });

    var buttons = $(to_reveal).find('.hide-button');
    this.hideButton = buttons[0];
    if (typeof hideButton != "undefined" && hideButton !== null) {
      this.hideButton.revealButton = this;
      $(this.hideButton).click(function () {
        $(to_reveal).slideToggle();
        $(this.revealButton).fadeIn();
        return false;
      });
    }
  };

  $.fn.stopRepeat = function(maxLength){
    return this.live('keypress', function(e) {
      if(this.value.length >= maxLength){
        if(e.which >= keyboard["0"] || e.which == keyboard["hTab"] || e.which == keyboard["Return"]){
          return false;
        }
      }
    });
  };

  $.fn.spinner = function() {
    if (this.children("div.spinner").length === 0) {
      this.css({ position: "relative" });
      var spinnerElement = $('<div class="spinner"></div>');
      this.prepend(spinnerElement);
      spinnerElement.fadeIn("fast");
    }
    return this;
  };

  $.fn.unspinner = function() {
    this.children("div.spinner").each( function(i, el){
      $(el).fadeOut("fast");
      $(el).remove();
    });
    return this;
  };

  $.fn.rebind = function(eventName, callback) {
    return $(this).unbind(eventName, callback).bind(eventName, callback);
  };

  $.fn.animateLastPointAward = function(amount) {
    if (amount > 200) amount = 200;
    var $element = $(this);
    var currentAmount = $element.text().toInteger();
    var newAmount = (currentAmount - amount);
    $element.text(newAmount);
    return $element.increment(parseInt(amount, 10), null, { incrementSize : 1, delay: 170 });
  };

  $.fn.animateLastMonetaryReward = function(amount) {
    if (amount > 6) amount = 6;
    var $element = $(this);
    var currentAmount = $element.text().replace("$","");
    var newAmount = (currentAmount - amount);
    $element.text($.formatCurrency(newAmount));
    return $element.incrementCents(amount * 100);
  };

  $.fn.increment = function(amount, formatter, options) {
    var $element = $(this);
    var settings = {
      incrementSize : 0.03,
      delay : 90
    };
    $.extend(settings, options);

    var startingNumber = parseFloat($element.text().replace("$", ""));
    var endingNumber = startingNumber + amount;

    var updateNumber = function() {
      startingNumber += settings.incrementSize;
      if(startingNumber > endingNumber) startingNumber = endingNumber;
      var value = startingNumber;
      if (formatter) value = formatter(value);
      $element.text(value);
      if(startingNumber < endingNumber) incrementAnimator.delay(updateNumber, settings.delay);
    };
    updateNumber();
    return $element;
  };

  $.fn.incrementCents = function(amount) {
    $(this).increment(amount/100, $.formatCurrency);
  };

  $.reloadParent = function(location) {
    if (window.opener) {
      if (window.opener.top === self || window.location.host == window.opener.top.location.host) {
        window.opener.top.location = '/';
      } else {
        window.opener.location = '/';
      }
      window.close();
    } else {
      document.location = '/';
    }
  };

}(jQuery));
