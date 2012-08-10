class SessionsController < ApplicationController

  def new
    foursquare = Foursquare::Base.new(CLIENT_ID, CLIENT_SECRET)
    @authorize_url = foursquare.authorize_url(CALLBACK_URL)
  end

  def callback
    code = params[:code]
    foursquare = Foursquare::Base.new(CLIENT_ID, CLIENT_SECRET)
    @access_token = foursquare.access_token(code,CALLBACK_URL)
    foursquare = Foursquare::Base.new(@access_token)
    user = foursquare.users.find("self")
    User.create(:name => user.name , :access_token => @access_token,  :uid => user.id)
    session[:access_token] = @access_token
    redirect_to root_path
  end

  def logout
    session[:access_token] = nil
    redirect_to root_path 
  end
end
