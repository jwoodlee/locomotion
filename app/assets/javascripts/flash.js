jQuery(function ($) {
  Flash = function(){
    var self = {};
    var flash = $("#flash")

    var template = function(key, message){
      return "<div id='flash_"+ key +"'><p>" + message + "</p></div>";
    }

    self.success = function(message){
      return flash.append(template('success', message));
    }

    self.failure = function(message){
      return flash.append(template('failure', message));
    }

    self.clear = function(){
      flash.children("div[id*='flash_']").each(function(){
        $(this).slideUp('slow');
      })
    }

    return self;
  }();
});
