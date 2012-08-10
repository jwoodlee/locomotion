$(function() {
  var segmentingPoll = (function() {
    var self = {};

    self.run = function() {
      var SegmentingPoll             = $.parseJSON($("#segmenting-poll-data-values").text());
      var addSegmentingPollLink      = $('a#add-new-segmenting-poll');
      var dialog                     = $(addSegmentingPollLink.attr('data-modal-target'));
      var activeSegmentingPollsLimit = parseInt(SegmentingPoll.max_active_segmenting_polls, 10);

      var setupDialog = function($element, options) {
        if ($element.length) {
          $element.dialog({
            modal: true,
            width: 500,
            resizeable: false,
            title: options['title']
          });
        }
      };

      addSegmentingPollLink.click(function(event) {
        setupDialog(dialog, { title: "Add Segmenting Poll" });
        event.preventDefault();
      });

      $('a.edit-segmenting-poll').live('click', function(event){
        var editDialog = $($(this).attr("data-modal-target"));
        setupDialog(editDialog, { title: "Edit Segmenting Poll" });
        event.preventDefault();
      });

      $('.edit-segmenting-poll-dialog form, #add-segmenting-poll-dialog form')
        .live("ajax:before", function() {
          $(this).parent().spinner();
          $(this).find(".error").remove();
          $(this).find('input[type=submit]')
            .val('Saving')
            .attr('disabled', 'disabled');
        })
        .live("ajax:success", function(event, data){
          $(this).find('input').val('');
          var editDialog = $(this).parent('.edit-segmenting-poll-dialog');
          if (editDialog.length > 0) {
            $('li[data-segmenting-poll-id="' + editDialog.attr('data-segmenting-poll-id') + '"]').remove();
            editDialog.dialog('close');
          } else {
            dialog.dialog('close');
          }
          $('#segmenting-polls-list').append(data.html);
        })
        .live("ajax:error", function(event, xhr) {
          var errors = $.parseJSON(xhr.responseText);
          var error_div = $("<div class='error'>" + errors.join(", ") + "</div>");
          $(this).prepend(error_div);
        })
        .live("ajax:complete", function(){
          $(this).find('input[type=submit]')
            .val('Save')
            .removeAttr('disabled');
          $(this).parent().unspinner();
          hideOrShowAddSegmentingPollLink();
        });

      var hideOrShowAddSegmentingPollLink = function() {
        if ( !SegmentingPoll.brand_launched ) {
          if ($("li.segmenting_poll").length >= activeSegmentingPollsLimit) {
            addSegmentingPollLink.hide();
          } else {
            addSegmentingPollLink.show();
          }
        }
      }

      var hideLaunchOptions = function() {
        if ($("li.segmenting_poll.active").length >= activeSegmentingPollsLimit) {
          $("ul#segmenting-polls-list").find("a.launch").parent("li").hide();
        };
      };

      var showLaunchOptions = function() {
        if ($("li.segmenting_poll.active").length < activeSegmentingPollsLimit) {
          $("li.segmenting_poll.unlaunched").find("a.launch").parent("li").show();
        };
      };

      $('.manage-custom-segmenting-polls a.remove, .manage-custom-segmenting-polls a.deactivate, .manage-custom-segmenting-polls a.launch').live('click', function(event) {
        var action = 'delete';
        var confirmationMessage = SegmentingPoll.delete_confirm_message;
        if ($(this).hasClass('deactivate')) {
          action = 'deactivate';
          confirmationMessage = SegmentingPoll.deactivate_confirm_message;
        } else if ($(this).hasClass('launch')) {
          action = 'launch';
          confirmationMessage = SegmentingPoll.launch_confirm_message;
        }

        var listItem                  = $(this).parent('li');
        var actionsList               = listItem.parent('ul');
        var segmentingPollListElement = listItem.parents("li.segmenting_poll")
        var container                 = $('.manage-custom-segmenting-polls');
        var segmentingPollId          = segmentingPollListElement.attr('data-segmenting-poll-id');
        var saveButton                = $("#submit-button");
        saveButton.attr("disabled", "disabled");

        var updateOptions = {
          'deactivate': {
            type: 'put',
            success: function() {
              listItem.hide();
              actionsList.find('a.launch').parent('li').show();
              segmentingPollListElement.removeClass("active");
              segmentingPollListElement.addClass("unlaunched");
              showLaunchOptions();
            }
          },
          'delete': {
            type: 'delete',
            success: function() {
              segmentingPollListElement.remove();
            }
          },
          'launch': {
            type: 'post',
            success: function() {
              listItem.hide();
              actionsList.find('a.deactivate').parent('li').show();
              actionsList.find('a.results').parent('li').show();
              actionsList.find('a.remove').parent('li').hide();
              segmentingPollListElement.addClass("active");
              segmentingPollListElement.removeClass("unlaunched");
              saveButton.removeAttr("disabled");
              hideLaunchOptions();
            }
          }
        };

        if (confirm(confirmationMessage)) {
          container.spinner();
          $.ajax($.extend({
            url: this.href,
            dataType: 'html',
            error: function(data) {
              var errors = $.parseJSON(data.responseText);
              alert(errors.join(", "));
            },
            complete: function() {
              container.unspinner();
              saveButton.removeAttr("disabled");
              hideOrShowAddSegmentingPollLink();
            }
          }, updateOptions[action]));
        }
        return false;
      });
    }

    return self;
  })();

  if ($("#segmenting-poll-data-values").length > 0 &&
      $("#segmenting-poll-js-loaded").length == 0) {
    $("body").append($("<div>", { id : "segmenting-poll-js-loaded", style : "display:none" }));
    segmentingPoll.run();
  }
});
