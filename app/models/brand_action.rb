class BrandAction
  include Mongoid::Document

  belongs_to :brand
  field :title, type: String
  field :url, type: String
end
