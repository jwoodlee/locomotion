class PagesController < ApplicationController

def show
@brand = Brand.where(:name => 'crowdtaphq').first

end


end
