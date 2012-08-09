class BrandAction
  include Mongoid::Document

  belongs_to :brand
  field :category, type: String
  field :url, type: String
end
