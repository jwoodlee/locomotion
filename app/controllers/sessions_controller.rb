class SessionsController < ApplicationController

  def new
    return redirect_to '/success' if current_user
    @authorize_url = foursquare.authorize_url(CALLBACK_URL)
  end
  
  def callback
    code = params[:code]
    @access_token = foursquare.access_token(code,CALLBACK_URL)
    user = foursquare.users.find("self")
    User.create(:name => user.name , :access_token => @access_token,  :uid => user.id)

    session[:access_token] = @access_token
    render :nothing => true, :status => 204
  end
 
  def logout
    session[:access_token] = nil
    redirect_to root_path 
  end

   def success

   end
end
