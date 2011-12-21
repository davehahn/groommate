class Customer < ActiveRecord::Base

  has_many :dogs, :dependent => :destroy
  accepts_nested_attributes_for :dogs, :reject_if => proc { |attrs| attrs['name'].blank? }, :allow_destroy => true

  validates :fname,:lname,:address,:prov,:country,:postal_code,:phone, :presence => true

  def full_name
    "#{self.lname}, #{self.fname}"
  end

  def forward_name
    "#{self.fname} #{self.lname}"
  end

  def self.conditions_by_like(value, *columns)
    columns = self.columns if columns.size==0
    columns = columns[0] if columns[0].kind_of?(Array)
    conditions = columns.map {|c|
        c = c.name if c.kind_of? ActiveRecord::ConnectionAdapters::Column
        "`#{table_name}`.`#{c}` LIKE " + ActiveRecord::Base.connection.quote("%#{value}%")
      }.join(" OR ")
  end

end


