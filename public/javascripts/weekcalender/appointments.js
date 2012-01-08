function setupCalendar() {
 
   var $calendar = $('#calendar');
  
   
   $calendar.weekCalendar({
      
      displayOddEven:true,
      timeslotsPerHour : 4,
      allowCalEventOverlap : true,
      overlapEventsSeparate: true,
      firstDayOfWeek : 1,
      businessHours :{start: 8, end: 18, limitDisplay: true},
      daysToShow : 7,
      switchDisplay: {'1 day': 1, '3 next days': 3, 'work week': 5, 'full week': 7},
      title: function(daysToShow) {
			return daysToShow == 1 ? '%date%' : '%start% - %end%';
      },
      height : function($calendar) {
         return $(window).height() - $("h1").outerHeight() - 1;
      },
      eventRender : function(calEvent, $event) {
         if (calEvent.end.getTime() < new Date().getTime()) {
            $event.css("backgroundColor", "#aaa");
            $event.find(".wc-time").css({
               "backgroundColor" : "#999",
               "border" : "1px solid #888"
            });
         }
      },
      draggable : function(calEvent, $event) {
         return calEvent.readOnly != true;
      },
      resizable : function(calEvent, $event) {
         return calEvent.readOnly != true;
      },
      eventNew : function(calEvent, $event) {
          $.get('new_appointment', {}, function(){

         var $dialogContent = $("#dialogBox");
         
         var startField = $dialogContent.find("select[name='appointment[start]']").val(calEvent.start);
         var endField = $dialogContent.find("select[name='appointment[end]']").val(calEvent.end);
         var bodyField = $dialogContent.find("textarea[name='body']");        
          
         $dialogContent.dialog({
                modal: true,
                title: "New Appointment",
                draggable: false,
                open: function(event, ui) { $(".ui-dialog-titlebar-close").hide();
                    initDogFinder();
                },
            close: function() {
               $dialogContent.dialog("destroy");
               $dialogContent.hide();               
               $('#calendar').weekCalendar("removeUnsavedEvents");
               $('input#appointment_dog_id').tokenInput("clear");
               $dialogContent.html("");
               /* REALLY CRAZY HACK TO REMOVE TOKEN BOX AFTER CREATE */
               $('.token-input-dropdown').remove();
            },
            buttons: {
               save : function() {
                   if($('li.token-input-token').length > 0){                       
                      var title = $('li.token-input-token p').html();                      
                      $('#new_appointment').ajaxSubmit({success: function(responseText){
                      calEvent.id = parseInt(responseText);                      
                      calEvent.start = new Date(startField.val());
                      calEvent.end = new Date(endField.val());
                      calEvent.title = title;
                      calEvent.body = bodyField.val();
                      $calendar.weekCalendar("removeUnsavedEvents");
                      $calendar.weekCalendar("updateEvent", calEvent);
                      $dialogContent.dialog("close");
                       if($('#dog').length > 0 ){
                        $('#dog').remove();
                       }
                       return false;
                      }});
                      
                   }else{
                      alert("Please Select a Customer/Dog");
                      return false;
                   }                  
               },
               cancel : function() {
                  $dialogContent.dialog("close");
               }
            }
         }).show();
         
         $dialogContent.find(".date_holder").text($calendar.weekCalendar("formatDate", calEvent.start));
         setupStartAndEndTimeFields(startField, endField, calEvent, $calendar.weekCalendar("getTimeslotTimes", calEvent.start));
          });
      },
      eventDrop : function(calEvent, $event) {
        $.ajax({url: 'drag_n_save',
               type: "POST",
               dataType: 'json',
               data: "id=" + calEvent.id + "&start_date=" + calEvent.start + "&end_date=" + calEvent.end
            });
      },
      eventResize : function(calEvent, $event) {
          $.ajax({url: 'resize_n_save',
              type: "POST",
              dataType: 'json',
              data: "id=" + calEvent.id + "&end_date=" + calEvent.end
            });
      },
      eventClick : function(calEvent, $event) {

         if (calEvent.readOnly) {
            return;
         }
         $.get('appointment_details', {id: calEvent.id},function(){
                
         })
         var $dialogContent = $("#dialogBox");
         
         /* var startField = $dialogContent.find("select[name='appointment[start]']").val(calEvent.start);
         console.log(startField)
         var endField = $dialogContent.find("select[name='appointment[end]']").val(calEvent.end);
         var titleField = $dialogContent.find("input[name='title']").val(calEvent.title);
         var bodyField = $dialogContent.find("textarea[name='body']");
         bodyField.val(calEvent.body);
         */
         $dialogContent.dialog({
            modal: true,
            title: "Appointment Details",
            close: function() {
               $dialogContent.dialog("destroy");
               $dialogContent.html("");
               $('#calendar').weekCalendar("removeUnsavedEvents");
            },
            buttons: {
               "reschedule" : function(){
                 $.post('reschedule_appointment', {id: calEvent.id}, null, "script");
                 $calendar.weekCalendar("removeEvent", calEvent.id);
                 $dialogContent.dialog("close");
               },
               "delete" : function() {
                   $.post('destroy_appointment', {id: calEvent.id, _method: 'delete'}, null, "script");
                  $calendar.weekCalendar("removeEvent", calEvent.id);
                  $dialogContent.dialog("close");
               },
               "close" : function() {
                  $dialogContent.dialog("close");
               }
            }
         }).show();

           var startField = $dialogContent.find("select[name='appointment[start]']").val(calEvent.start);
         var endField = $dialogContent.find("select[name='appointment[end]']").val(calEvent.end);
         $dialogContent.find(".date_holder").text($calendar.weekCalendar("formatDate", calEvent.start));
         setupStartAndEndTimeFields(startField, endField, calEvent, $calendar.weekCalendar("getTimeslotTimes", calEvent.start));
         $(window).resize().resize(); //fixes a bug in modal overlay size ??
        
      },
      eventMouseover : function(calEvent, $event) {
      },
      eventMouseout : function(calEvent, $event) {
      },
      noEvents : function() {

      },
      data : function(start, end, callback) {         
            $.getJSON("get_appointments",
                "start_date=" + start + "&end_date=" + end,
                function(result) {
                    callback(result);
                });
        }
   });
 
   function resetForm($dialogContent) {
      $dialogContent.find("input").val("");
      $dialogContent.find("textarea").val("");
   }

function getEventData(start,end) {  
       var arr1 = [];
       $.ajax({url: 'get_appointments',
              async: false,
              dataType: 'json',
              data: "start_date=" + start + "&end_date=" + end,
              success: function (json) {
                arr1 = json;
              }
            });
     return {
        events : arr1
      };
   }

   /*
    * Sets up the start and end time fields in the calendar event
    * form for editing based on the calendar event being edited
    */
   function setupStartAndEndTimeFields($startTimeField, $endTimeField, calEvent, timeslotTimes) {

      $startTimeField.empty();
      $endTimeField.empty();

      for (var i = 0; i < timeslotTimes.length; i++) {
         var startTime = timeslotTimes[i].start;
         var endTime = timeslotTimes[i].end;
         var startSelected = "";
         if (startTime.getTime() === calEvent.start.getTime()) {
            startSelected = "selected=\"selected\"";
         }
         var endSelected = "";
         if (endTime.getTime() === calEvent.end.getTime()) {
            endSelected = "selected=\"selected\"";
         }
         $startTimeField.append("<option value=\"" + startTime + "\" " + startSelected + ">" + timeslotTimes[i].startFormatted + "</option>");
         $endTimeField.append("<option value=\"" + endTime + "\" " + endSelected + ">" + timeslotTimes[i].endFormatted + "</option>");

         $timestampsOfOptions.start[timeslotTimes[i].startFormatted] = startTime.getTime();
         $timestampsOfOptions.end[timeslotTimes[i].endFormatted] = endTime.getTime();

      }
      $endTimeOptions = $endTimeField.find("option");
      $startTimeField.trigger("change");
   }

   var $endTimeField = $("select[name='end']");
   var $endTimeOptions = $endTimeField.find("option");
   var $timestampsOfOptions = {start:[],end:[]};

   //reduces the end time options to be only after the start time options.
   $("select[name='start']").change(function() {
      var startTime = $timestampsOfOptions.start[$(this).find(":selected").text()];
      var currentEndTime = $endTimeField.find("option:selected").val();
      $endTimeField.html(
            $endTimeOptions.filter(function() {
               return startTime < $timestampsOfOptions.end[$(this).text()];
            })
            );

      var endTimeSelected = false;
      $endTimeField.find("option").each(function() {
         if ($(this).val() === currentEndTime) {
            $(this).attr("selected", "selected");
            endTimeSelected = true;
            return false;
         }
      });
      if (!endTimeSelected) {
         //automatically select an end date 2 slots away.
         $endTimeField.find("option:eq(1)").attr("selected", "selected");
      }

   });

//cancel button if we have a dog object to create the appointment from //

if($('#dog')){
 $('#cancelCreateLink').bind('click', function(){
     $('#dog').slideUp( function(){
         $('#dog').remove();
         $('input#appointment_dog_id').tokenInput("clear");
     })
 })
}

 function initDogFinder(){
  if($('#token-input-appointment_dog_id').length == 0){
   $('input#appointment_dog_id').tokenInput('find_dog',{            
            tokenLimit: 1,
            hintText: "Find a Customer/Dog",
            prePopulate: populate()          
          })
  }else{
      populateAutoComplete();
  }
 }
 
 function populate(){
  if($('#dog').length > 0 ){
       var id_token = $('#dog').data('id_token');
       var name_token = $('#dog').data('name_token');
       var value = [{id: id_token, name: name_token}];
     }else{
         value = null;
     }     
     return value
 }
 function populateAutoComplete(){
     var pop = populate();
     if(pop != null){                
       $('input#appointment_dog_id').tokenInput("add", pop[0] )
     }
 }
}
