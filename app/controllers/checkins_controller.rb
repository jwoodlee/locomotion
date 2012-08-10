class CheckinsController < ApplicationController


  def create
    checkin=JSON.parse(params['checkin'])
    checkin_id = checkin["id"]
    checkin_user = checkin["user"]
    user_id  = checkin_user["id"]
    venue = checkin["venue"]
    venue_name = venue["name"]
    user = User.where(:uid => user_id).first
    user.checkins.create(:checkin_id => checkin_id, :venue_name => venue_name)
    logger.info "checkin #{checkin}"
    logger.info "user #{user}"
    logger.info "db user is  " + user.to_json
    send_reply_to(checkin_id, user, venue_name)
  end

  def send_reply_to(checkin_id, user, venue_name)
    brand = Brand.where(:name => venue_name).first
    brand = Brand.where(:name => "crowdtap").first unless brand.present?
    response_url = 'http://thawing-headland-3901.herokuapp.com/brands/' + brand.name + "?user_id=#{user.id}"
    RestClient.post 'https://api.foursquare.com/v2/checkins/' + checkin_id + '/reply',
      :CHECKIN_ID => checkin_id,
      :oauth_token => user.access_token ,
      :url => response_url,
      :text => 'Awesome you checked! Tap here for a chance to win more points.' + response_url,
      :v => '20120801'
  end

  def add_post(checkin_id, user, venue_name)
    logger.info "************adding post *********************"
    RestClient.post 'https://api.foursquare.com/v2/checkins/' + checkin_id + '/addpost',
      :CHECKIN_ID => checkin_id,
      :oauth_token => user.access_token,
      :text => "I just earned a 100 points from Crowdtap for completing a #{venue_name} challenge",
      :v => '20120801'
  end

end

