$(function(){
  var modalElement = $('.expandable-in-modal');

  if(modalElement.length != 0){
    modalElement.click(function() {
      var $element = $('#modal-content');
      var _params  = { modal: true, width: 900 };

      var _close = function(){
        $element.dialog('close');
        return false;
      };

      $element.dialog(_params).find('button.cancel').click(_close);

      return false;
    });
  }
});
