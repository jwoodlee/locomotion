class ApplicationController < ActionController::Base

  helper_method :current_user

  private

  def current_user
    u = nil
    if session[:access_token]
      u = User.where(:access_token => session[:access_token]).first
    elsif params[:user_id].present?
      u=User.find(params[:user_id])
      session[:access_token] = u.access_token
    end
    u
  end
end

