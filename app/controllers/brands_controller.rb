class BrandsController < ApplicationController
  

def show
 @brand=Brand.where(:name => params[:name]).first
end

end
