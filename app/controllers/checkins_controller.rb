class CheckinsController < ApplicationController


  def create

    checkin = params["checkin"]["id"]
    userid  = params["user"]["id"]
    response_url = 'http://www.crowdtap.com'

    RestClient.post 'https://api.foursquare.com/v2/checkins/' + checkin + '/reply', 
      :CHECKIN_ID => checkin, 
      :oauth_token => User.where(:uid => userid).first.access_token ,
      :url => response_url,
      :text => 'Awesome you checked in go here ' + response_url,
      :v => '20120801'
  end


end
