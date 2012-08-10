class User
  include Mongoid::Document
  include Mongoid::Timestamps

  has_many :checkins

  field :access_token, type: String
  field :uid, type: String
  field :name, type: String
end
