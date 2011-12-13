class DogsController < ApplicationController
  # GET /dogs
  # GET /dogs.xml
  def index
    @dogs = Dog.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @dogs }
    end
  end

  # GET /dogs/1
  # GET /dogs/1.xml
  def show
    @dog = Dog.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.js
    end
  end

  # GET /dogs/new
  # GET /dogs/new.xml
  def new
    @customer = Customer.find(params[:customer_id])
    @dog = @customer.dogs.new

    respond_to do |format|
      format.html # new.html.erb
      format.js
    end
  end

  # GET /dogs/1/edit
  def edit
    @dog = Dog.find(params[:id])

    respond_to do |format|
      format.html 
      format.js
    end
  end

  # POST /dogs
  # POST /dogs.xml
  def create
    @dog = Dog.new(params[:dog])
    @customer = Customer.find(params['dog']['customer_id'])
    respond_to do |format|
      if @dog.save
        @customer.reload
        format.html { redirect_to(@dog, :notice => 'Dog was successfully created.') }
        format.js
      else
        format.html { render :action => "new" }
        format.js
      end
    end
  end

  # PUT /dogs/1
  # PUT /dogs/1.xml
  def update
    @dog = Dog.find(params[:id])

    respond_to do |format|
      if @dog.update_attributes(params[:dog])
        format.html { redirect_to(@dog, :notice => 'Dog was successfully updated.') }
        format.js
      else
        format.html { render :action => "edit" }
        format.js
      end
    end
  end

  # DELETE /dogs/1
  # DELETE /dogs/1.xml
  def destroy
    @dog = Dog.find(params[:id])
    @dog.destroy

    respond_to do |format|
      format.html { redirect_to(dogs_url) }
      format.xml  { head :ok }
    end
  end
end
