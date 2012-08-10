class CheckinsController < ApplicationController


  def create
    checkin=JSON.parse(params['checkin'])
    checkin_id = checkin["id"]
    checkin_user = checkin["user"]
    user_id  = checkin_user["id"]
    venue = checkin["venue"]
    venue_name = venue["name"].downcase
    user = User.where(:uid => user_id).first
    logger.info "checkin #{checkin}"
    logger.info "user #{user}"
    logger.info "db user is  " + user.to_json
    send_reply_to(checkin_id, user, venue_name)
  end


  def send_reply_to(checkin_id, user, venue_name)
    brand = Brand.where(:name => venue_name).first
    brand = Brand.where(:name =>'crowdtap').first  unless brand.present?
      response_url = 'http://thawing-headland-3901.herokuapp.com/brands/' + brand.name
      RestClient.post 'https://api.foursquare.com/v2/checkins/' + checkin_id + '/reply',
        :CHECKIN_ID => checkin_id,
        :oauth_token => user.access_token ,
        :url => response_url,
        :text => '<b>Awesome Checkin!</b><br>25 points for Tapping In At ' + venue_name + '<u>Tap To See In Store Opporitunities</u>',
        :v => '20120801'
      add_post(checkin_id, user, venue_name)
  end

  def add_post(checkin_id, user, venue_name)
    RestClient.post 'https://api.foursquare.com/v2/checkins/' + checkin["id"] + '/addpost',
      :CHECKIN_ID => checkin["id"],
      :oauth_token => user.access_token,
      :text => "#{user.name} just earned 100 points from Crowdtap for completing a #{venue_name} challenge",
      :v => '20120801'
  end

end

