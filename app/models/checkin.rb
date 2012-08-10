class Checkin
  include Mongoid::Document
  include Mongoid::Timestamps

  belongs_to :user

  field :checkin_id, type: String
  field :venue_name, type: String
end
