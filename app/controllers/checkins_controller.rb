class CheckinsController < ApplicationController


  def create

    checkin=JSON.parse(params['checkin'])

    #checkin = params["checkin"]["id"]
    #check = params["checkin"]
    user = checkin["user"]

    logger.info "checkin #{checkin}"
    logger.info "user id #{user['id']}"

    userid  = user["id"]
    logger.info "userid for checkin #{userid}"
    user = User.where(:uid => userid).first 
    logger.info "user is  " + user.to_json

    response_url = 'http://www.crowdtap.com'

    RestClient.post 'https://api.foursquare.com/v2/checkins/' + checkin["id"] + '/reply', 
      :CHECKIN_ID => checkin["id"], 
      :oauth_token => user.access_token ,
      :url => response_url,
      :text => 'Awesome you checked in go here ' + response_url,
      :v => '20120801'
  end


end
