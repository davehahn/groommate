class Dog < ActiveRecord::Base

  belongs_to :customer
  has_many :comments, :as => :commentable
  has_many :appointments
  validates :name,:breed, :presence => true

  def self.conditions_by_like(value, *columns)
    columns = self.columns if columns.size==0
    columns = columns[0] if columns[0].kind_of?(Array)
    conditions = columns.map {|c|
        c = c.name if c.kind_of? ActiveRecord::ConnectionAdapters::Column
        "`#{table_name}`.`#{c}` LIKE " + ActiveRecord::Base.connection.quote("%#{value}%")
      }.join(" OR ")
  end

  def self.search(value)
    dog_conditions = self.conditions_by_like(value, [:name])
    customer_conditions = Customer.conditions_by_like(value, [:lname,:fname])
    self.includes(:customer).where("#{dog_conditions} OR #{customer_conditions}")
  end


end
