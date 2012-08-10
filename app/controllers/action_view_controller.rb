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

  def add_post(checkin_id, user, venue_name, options)
    logger.info "************adding post *********************"
    challenge = "I just earned a 100 points on Crowdtap for "
    case options[:action_view][:category]
    when "poll"
      challenge += "answering the - Where did the first #{venue_name} open? - Poll with #{options[:action_view][:choice]}"
    when "share"
      challenge += "saying - #{options[:action_view][:share_text]} - about their exprience at #{venu_name}"
    when "hunt"
      challenge += "finding their favourite item at #{venue_name} - #{options[:action_view][:share_text]}"
    end
    RestClient.post 'https://api.foursquare.com/v2/checkins/' + checkin_id + '/addpost',
      :CHECKIN_ID => checkin_id,
      :oauth_token => user.access_token,
      :text => challenge,
      :v => '20120801'
  end


  def create
     logger.info "first #{params["action_view"]["brand_id"]}"

     @brand = Brand.find(params["action_view"]["brand_id"])
     logger.info "current user => #{current_user}"
     logger.info "access token => #{session[:access_token]}"
     checkin = current_user.checkins.last
     add_post checkin.check_id, current_user, checkin.venu_name, params
  end
end
