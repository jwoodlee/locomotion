class ActionViewController < ApplicationController

  def index
    @brand = Brand.find(params[:brand_id])
    @venue_name = params["venue_name"]
    @category = params["category"]
    case @category
    when "poll" then render 'poll'
    when "share" then render 'share'
    when "hunt" then render 'hunt'
    end
  end

  def add_post(checkin_id, user, venue_name)
    logger.info "************adding post *********************"
    RestClient.post 'https://api.foursquare.com/v2/checkins/' + checkin_id + '/addpost',
      :CHECKIN_ID => checkin_id,
      :oauth_token => user.access_token,
      :text => "I just earned a 100 points from Crowdtap for completing a #{venue_name} challenge",
      :v => '20120801'
  end


  def create

     logger.info "current user => #{current_user}"
     logger.info "access token => #{session[:access_token]}"
     checkin = current_user.checkins.last
     add_post checkin.checkin_id, current_user, checkin.venu_name
  end
end
