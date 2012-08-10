class CheckinsController < ApplicationController


  def create

    checkin = params["checkin"]["id"]
    check = params["checkin"]
    logger.info "checkin  #{checkin} check #{check}"
    mystuff = ActiveSupport::JSON.decode(check)
    logger.info "mysterious id #{mystuff[:id]}"

    userid  = params["user"]["id"]
    logger.info "userid for checkin #{userid}"
    user = User.where(:uid => userid).first 
    logger.info "user is  " + user.to_json

    response_url = 'http://www.crowdtap.com'

    RestClient.post 'https://api.foursquare.com/v2/checkins/' + checkin + '/reply', 
      :CHECKIN_ID => checkin, 
      :oauth_token => user.access_token ,
      :url => response_url,
      :text => 'Awesome you checked in go here ' + response_url,
      :v => '20120801'
  end


end
