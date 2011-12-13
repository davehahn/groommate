class CreateCustomers < ActiveRecord::Migration
  def self.up
    create_table :customers do |t|
      t.string :fname
      t.string :lname
      t.string :address
      t.string :prov
      t.string :country
      t.string :postal_code
      t.string :email
      t.string :phone

      t.timestamps
    end
  end

  def self.down
    drop_table :customers
  end
end
