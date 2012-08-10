class ActionViewController < ApplicationController

  def index
    @category = params["category"]
    case @category
    when "poll" then render 'poll'
    when "share" then render 'share'
    when "hunt" then render 'hunt'
    end
  end
end
