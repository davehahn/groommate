class Dog < ActiveRecord::Base

  belongs_to :customer
  has_many :comments, :as => :commentable
  has_many :appointments
  validates :name,:breed, :presence => true
end
