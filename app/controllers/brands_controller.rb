class BrandsController < ApplicationController
  

def show
  u=current_user
  @brand=Brand.where(:name => params[:name]).first
end

end
