$(function(){
  $('.modal-configuration').click(function(event){
    var $brand_action_group = $(this).parent(".brand-action-group"),
    modal_id = $brand_action_group.data("modal_div_id"),
    modal_title = $brand_action_group.data("modal_title");
    $('#' + modal_id).dialog({
      autoOpen:  false,
      modal:     true,
      resizable: false,
      draggable: false,
      title:     'Choose a type of ' + modal_title,
      width:     '455px'
    });
    $('#' + modal_id).dialog('open');
    return false;
  });

  $(".expand-actions.closed").live("click", function(){
    $(this).removeClass("closed").addClass("open");
    var $container = $(this).closest("div");
    $container.find(".brand-actions-list").show();
    return false;
  });

  $(".expand-actions.open").live("click", function(){
    $(this).removeClass("open").addClass("closed");
    var $container = $(this).closest("div");
    $container.find(".brand-actions-list").hide();
    return false;
  });

  $(".brand-action-group .with-icon").click(function(){
    var $container        = $(this).closest("div");
    var $brandActionsList = $container.find(".brand-actions-list");
    var $arrowElement     = $container.find(".expand-actions");
    if($brandActionsList.length > 0) {
      if($brandActionsList.is(":visible")){
        $arrowElement.removeClass("open").addClass("closed");
      } else {
        $arrowElement.removeClass("closed").addClass("open");
      }
      $brandActionsList.toggle();
    }
    return false;
  });
});
