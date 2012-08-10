class BrandsController < ApplicationController
  

def show
  u=current_user
  logger.info "inside show #{u}"
  @brand=Brand.where(:name => params[:name]).first
end

end
