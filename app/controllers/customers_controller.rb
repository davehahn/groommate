class CustomersController < ApplicationController

  helper_method :sort_column, :sort_direction

  # GET /customers
  # GET /customers.xml
  def index
      if params[:search] && !params[:search].empty?
      conditions = "(#{Customer.conditions_by_like(params[:search])})"
    else
      conditions = ""
    end

    @customers = Customer.where(conditions).order("#{sort_column[1]} #{sort_direction}")

    respond_to do |format|
      format.html # index.html.erb
      format.js
    end
  end

  # GET /customers/1
  # GET /customers/1.xml
  def show
    @customer = Customer.find(params[:id])
    @customer.dogs.new
    respond_to do |format|
      format.html # show.html.erb
      format.js
    end
  end

  # GET /customers/new
  # GET /customers/new.xml
  def new
    @customer = Customer.new

    respond_to do |format|
      format.html # new.html.erb
      format.js # new.js.erb
    end
  end

  # GET /customers/1/edit
  def edit
    @customer = Customer.find(params[:id])
    respond_to do |format|
      format.html 
      format.js 
    end
  end

  # POST /customers
  # POST /customers.xml
  def create
    @customer = Customer.new(params[:customer])
    
    respond_to do |format|
      if @customer.save
        format.html { redirect_to(@customer, :notice => 'Customer was successfully created.') }
        format.js
      else        
        format.html { render :action => "new" }
        format.js
      end
    end
  end

  # PUT /customers/1
  # PUT /customers/1.xml
  def update
    @customer = Customer.find(params[:id])
   
    respond_to do |format|
      if @customer.update_attributes(params[:customer])       
        format.html { redirect_to(@customer, :notice => 'Customer was successfully updated.') }
        format.js
      else       
        format.html { render :action => "edit" }
        format.js
      end
    end
  end

  # DELETE /customers/1
  # DELETE /customers/1.xml
  def destroy
    @customer = Customer.find(params[:id])
    @customer.destroy

    respond_to do |format|
      format.html { redirect_to(customers_url) }
      format.xml  { head :ok }
    end
  end

  private

  def sort_column
    #params[:sort] == '' ? ['company','companies.name'] :
     Customer.column_names.include?(params[:sort]) ? [params[:sort], params[:sort]] : ['lname',"lname"]
  end

  def sort_direction
    %w[asc desc].include?(params[:direction]) ?  params[:direction] : "asc"
  end
end
