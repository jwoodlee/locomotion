$(document).ready(function () {
  $('#onboarding-tutorial-lightbox').dialog({
    autoOpen:  false,
    modal:     true,
    resizable: false,
    draggable: false,
    title:     'Onboarding Tutorial',
    width:     '820',
    dialogClass:     'noTitleBar'
  });

  $(document).bind("open-onboarding-tutorial", function() {
    $("#onboarding-tutorial-lightbox").dialog("open");
  });

  var resetTutorial = function(){
    $('.onboarding-tutorial-slide').hide();
    $("#onboarding-tutorial-slide-1").show();
  };

  $("#continue-onboarding-1").click(function(){
    $('#onboarding-tutorial-slide-1').hide();
    $('#onboarding-tutorial-slide-2').show();
  });

  $("#continue-onboarding-2").click(function(){
    $('#onboarding-tutorial-slide-2').hide();
    $('#onboarding-tutorial-slide-3').show();
  });

  $("#continue-onboarding-3").click(function(){
    $('#onboarding-tutorial-slide-3').hide();
    $('#onboarding-tutorial-slide-4').show();
  });

  $("#continue-onboarding-4").click(function(){
    $('#onboarding-tutorial-slide-4').hide();
    $('#onboarding-tutorial-slide-5').show();
  });

  $('#finish-onboarding').bind('ajax:complete', function(){
    $('#onboarding-tutorial-lightbox').dialog('close');
    resetTutorial();
    window.location.reload();
  });

  resetTutorial();

  $('#friend-invite-modal a.btn').click(function(event){
    event.preventDefault();
    $('#friend-invite-modal').dialog('close');
  });
});
