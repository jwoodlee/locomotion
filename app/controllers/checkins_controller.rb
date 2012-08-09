class CheckinsController < ApplicationController


  def create

    logger.info  "i recieved #{params}"
    checkin = params[:checkin][:id]
    response_url = 'http://www.crowdtap.com'

    RestClient.post 'https://api.foursquare.com/v2/checkins/' + checkin + '/reply', 
      :CHECKIN_ID => checkin, 
      :oauth_token => session[:access_token],
      :url => response_url,
      :text => 'Awesome you checked in go here ' + response_url,
      :v => '20120801'
  end


end
