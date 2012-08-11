class CheckinsController < ApplicationController


  def create
    checkin=JSON.parse(params['checkin'])
    checkin_id = checkin["id"]
    checkin_user = checkin["user"]
    user_id  = checkin_user["id"]
    venue = checkin["venue"]
    venue_name = venue["name"]
    user = User.where(:uid => user_id).first
    if user.present? 
      user.checkins.create(:checkin_id => checkin_id, :venue_name => venue_name) 
      logger.info "checkin #{checkin}"
      logger.info "user #{user}"
      logger.info "db user is  " + user.to_json
      send_reply_to(checkin_id, user, venue_name) 
    end
    render :nothing => true , :status => 204
  end

  def send_reply_to(checkin_id, user, venue_name)
    venue_name=venue_name.gsub(' ','').downcase
    brand = Brand.where(:name => venue_name).first
    if  brand.present?
      response_url = 'http://thawing-headland-3901.herokuapp.com/brands/' + brand.name + "?user_id=#{user.id}"
      RestClient.post 'https://api.foursquare.com/v2/checkins/' + checkin_id + '/reply',
      :CHECKIN_ID => checkin_id,
      :oauth_token => user.access_token ,
      :url => response_url,
      :text => 'Awesome CheckIn! You Got +25 CrowdTap Points.  Tap here for more In Store Activities with CrowdTap.',
      :v => '20120801'
    elsif venue_name =="Walmart"
       response_url = "http://thawing-headland-3901.herokuapp.com/pages/walmart.html?user_id=#{user.id}"
      RestClient.post 'https://api.foursquare.com/v2/checkins/' + checkin_id + '/reply',
      :CHECKIN_ID => checkin_id,
      :oauth_token => user.access_token ,
      :url => response_url,
      :text => 'Awesome CheckIn! You Got +25 CrowdTap Points.  Tap here for more In Store Activities with CrowdTap.',
      :v => '20120801'
    else

      logger.info "VENUE NOT FOUND ==> #{venue_name}"
    end

  end


end

