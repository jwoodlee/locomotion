class SessionsController < ApplicationController

  def new
    return redirect_to examples_path if current_user
    @authorize_url = foursquare.authorize_url(CALLBACK_URL)
  end
  
  def callback
    code = params[:code]
    @access_token = foursquare.access_token(code,CALLBACK_URL)
    session[:access_token] = @access_token
    
    redirect_to brand_path Brand.first 
  
  end
  
end
