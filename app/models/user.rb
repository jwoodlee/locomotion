class User
  include Mongoid::Document
  include Mongoid::Timestamps

  field :access_token, type: String
  field :uid, type: String
  field :name, type: String
end
