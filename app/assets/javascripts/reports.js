$('#edit-report-photos').live('submit', function(){
  var values = $(this).find("input[type=file]").filter(function(){
    return !($(this).val() == "");
  });
  if(values.length === 0){
    $('#photo-upload-warning-modal').dialog({ modal: true, width: 200, height: 100 });
    return false;
  };
});
$('#edit-report-photos').find("input[type=file]").live('click', function(){
  $('#edit-report-photos').find('button').removeAttr('disabled');
});
