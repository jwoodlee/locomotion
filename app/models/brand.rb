class Brand
  include Mongoid::Document
  include Mongoid::Timestamps

  has_many :brand_actions
  field :name, type: String
end
