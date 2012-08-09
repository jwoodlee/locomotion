class SessionsController < ApplicationController

  def new
    @authorize_url = foursquare.authorize_url(CALLBACK_URL)
  end
  
  def callback
    code = params[:code]
    @access_token = foursquare.access_token(code,CALLBACK_URL)
    session[:access_token] = @access_token

    render :nothing => true, :status => 204
  end
 
  def logout
    session[:access_token] = nil
    redirect_to root_path 
  end

end
