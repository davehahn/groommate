class AppointmentsController < ApplicationController  

  # GET /appointments
  # GET /appointments.xml
  def index
    @dog = Dog.find(params[:dog], :include => :customer)if params[:dog]
    respond_to do |format|
      format.html
      format.js
    end
  end

  def search_for_dog
    dogs = params[:q].blank? ? Dog.all : Dog.search(params[:q])
    render :json => dogs.map{|d| {:id => d.id, :name => "<b>#{d.customer.forward_name}</b><br />#{d.name} - #{d.breed}"}}
  end

  def get_appointments
    start_date = params[:start_date].to_date
    end_date = params[:end_date].to_date
    range = start_date..end_date
    @appointments = Appointment.where(:start => range)
    events = []
    unless @appointments.empty?
    @appointments.each do |event|
      events << { :id => event.id, :start => event.start.strftime('%Y-%m-%d %H:%M:%S'), :end => event.end.strftime('%Y-%m-%d %H:%M:%S'), :title => "<b>#{event.dog.customer.forward_name}</b> <br /> #{event.dog.name}-#{event.dog.breed}"}
    end
    end
    respond_to do |format|
      format.js { render :json => events}
    end
  end

  def drag_n_save
    appointment = Appointment.find(params[:id])
    appointment.update_attributes(:start => params[:start_date].to_time, :end => params[:end_date].to_time)
    render :nothing => true
  end

  def resize_n_save
    appointment = Appointment.find(params[:id])
    appointment.update_attributes(:end => params[:end_date].to_time)
    render :nothing => true
  end

  # GET /appointments/1
  # GET /appointments/1.xml
  def show
    @appointment = Appointment.find(params[:id], :include => :dog)

    respond_to do |format|
      format.html # show.html.erb
      format.js
    end
  end

  # GET /appointments/new
  # GET /appointments/new.xml
  def new
    @appointment = Appointment.new
    @start_date = params[:start_date].to_date

    respond_to do |format|
      format.html # new.html.erb
      format.js  {  }
    end
  end

  # GET /appointments/1/edit
  def edit
    @appointment = Appointment.find(params[:id])
  end

  # POST /appointments
  # POST /appointments.xml
  def create
   
    @appointment = Appointment.new(:dog_id => params[:appointment][:dog_id], :start => params[:appointment][:start].to_time, :end => params[:appointment][:end].to_time)
   
    respond_to do |format|
      if @appointment.save
        format.html { redirect_to(@appointment, :notice => 'Appointment was successfully created.') }
        format.js { render :nothing => true}
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @appointment.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /appointments/1
  # PUT /appointments/1.xml
  def update
    @appointment = Appointment.find(params[:id])

    respond_to do |format|
      if @appointment.update_attributes(params[:appointment])
        format.html { redirect_to(@appointment, :notice => 'Appointment was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @appointment.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /appointments/1
  # DELETE /appointments/1.xml
  def destroy
    @appointment = Appointment.find(params[:id])
    @appointment.destroy

    respond_to do |format|
      format.html { redirect_to(appointments_url) }
      format.xml  { head :ok }
    end
  end
end
