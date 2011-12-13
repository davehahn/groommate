class CreateComments < ActiveRecord::Migration
  def self.up
    create_table :comments do |t|
      t.text :content
      t.integer :commentable_id
      t.string :commentable_type
      t.string :commenter
      t.timestamps
    end
    remove_column :dogs, :comments
  end

  def self.down
    drop_table :comments
  end
end
