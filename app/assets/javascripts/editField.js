$(function(){
  $('.edit-topic-button').live('click', function(event){
    event.preventDefault();
    var info = '#' + $(this).data("moderated-topic-displayed-info");
    var form = '#' + $(this).data("moderated-topic-info-form");
    $(info).hide();
    $(form).show();
    $(form).bind('ajax:beforeSend', function(){
      $(form).spinner();
    })
    .bind('ajax:complete', function(data, status, xhr){
      $(form).unspinner();
    })
    .bind('ajax:success', function(data, status, xhr){
      var title = $(form).children("input[name*=title]").val();
      var url   = $(form).children("input[name*=url]").val();
      $(info).find("h3 a").html(title);
      $(info).find("a[target*=_blank]").html(url);
      $(info).show();
      $(form).hide();
    })
    .bind('ajax:error', function(event, xhr, status, error){
      var response_text = $.parseJSON(xhr.responseText);
      var html = "";

      html = $.map(response_text, function(key, value) {
        return key + " " + value;
      }).join(", ");

      Flash.failure("Something went wrong : "+html);
    });
  });
});

var editField = function() {

  var getData = function($element, value) {
    var data = {}
    data[$element.attr("data-model")] = {};
    data[$element.attr("data-model")][$element.attr("data-field")] = value;
    return data;
  };

  var neverShorten = function($element) {
    $element.css("min-height", $element.height());
  };

  var wireLinks = function() {

    $(".edit-text").each(function() {
      neverShorten($(this).parent());
      $(this).unbind("click");
      $(this).click(function() {
        var field = $(this).siblings(".editable");
        var link = $(this);
        var wrapper = $("<span class='link-wrapper'>");
        var inputText = $("<input>", { type:'text', 'class':'edit-field'}).val(field.text());
        var submitLink = $("<a>", {'class':"submit round-orange-button"}).text("submit");
        var cancelLink = $("<a>", {'class':"cancel round-grey-button"}).text("cancel");

        wrapper.append(inputText).append(submitLink).append(cancelLink);
        field.replaceWith(wrapper);
        var fieldName = field.attr("data-field");

        cancelLink.unbind("click");
        cancelLink.click(function() {
          wrapper.replaceWith(field);
          link.show();
          return false;
        });

        submitLink.unbind("click");
        submitLink.click(function() {
          wrapper.parent().spinner();
          $.ajax({
            type: "PUT",
            url: link.attr("href"),
            data: getData(field, inputText.val()),
            success: function(data) {
              wrapper.parent().unspinner();
              field.text(data[fieldName]);
              wrapper.replaceWith(field);
              link.show();
              return false;
            },
            error: function(response) {
              errors = $.parseJSON(response.responseText)
              var errorMessage = errors[fieldName][0];
              wrapper.prepend($("<div>", {'class':"error"}).text(errorMessage));
              wrapper.parent().unspinner();
            }
          });
        });

        link.hide();
        return false;
      });
    });
  };

  return { init: wireLinks };
}();
$(editField.init);
