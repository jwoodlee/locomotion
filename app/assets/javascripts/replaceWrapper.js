var replaceWrapper = function() {
  $(".replace-wrapper").click(function() {
    var $wrapper = $(this).closest(".wrapper");
    $wrapper.spinner();
    $.ajax({
      type: "GET",
      dataType: "html",
      url: $wrapper.attr("data-url"),
      success: function(response) {
        $wrapper.unspinner();
        $wrapper.html(response);
        return false;
      }
    });
    return false;
  });
};
$(replaceWrapper);
