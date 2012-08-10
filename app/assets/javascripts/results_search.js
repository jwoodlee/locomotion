jQuery(document).ready(function ($) {
  $("#filter-search-submit").live("click", function(event) {
    reloadResponses();
    event.preventDefault();
  });

  $("#filter-search-clear").live("click", function(event) {
    $("#filter-search-box").val("");
    reloadResponses();
    event.preventDefault();
  });

  var reloadResponses = function() {
    var $parentForm = $("#filter-search-submit").closest('form');
    var $searchBox  = $("#filter-search-box");
    var $wrapper = $($searchBox.data("target"));

    $wrapper.spinner();

    $.get(window.location.toString(), $parentForm.serialize(), function(data) {
      $wrapper.html(data);
      $wrapper.unspinner();
      $(".ajax-pagination").trigger("loading-complete");
      $(".ajax-pagination .pagination a").attr("data-remote", "true").attr("data-type", "html").addClass("page");
      $wrapper.slideForm();
    }, 'html');
  };

  $(".ajax-pagination").bind("loading-complete", function() {
    var search_text = $("#filter-search-box").val();
    if(search_text) {
      highlightResponses(search_text);
    }
  });

  var highlightResponses = function(text) {
    var $responses = $('.searchable');
    var pattern = new RegExp("(" + text + ")", "ig");
    $responses.each(function() {
      $(this).html($(this).html().replace(pattern, "<mark class='highlight'>$1</mark>"));
    });
  };
});
