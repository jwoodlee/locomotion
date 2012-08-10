class ApplicationController < ActionController::Base
  protect_from_forgery

  helper_method :current_user

  private

  def current_user
    if session[:access_token]
      User.where(:access_token => session[:access_token]).first
    else
      nil
    end
  end
end
