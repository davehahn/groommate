class CreateDogs < ActiveRecord::Migration
  def self.up
    create_table :dogs do |t|
      t.integer :customer_id
      t.string :name
      t.string :breed
      t.text :comments

      t.timestamps
    end
  end

  def self.down
    drop_table :dogs
  end
end
