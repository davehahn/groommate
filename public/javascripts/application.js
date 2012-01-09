 jQuery.ajaxSetup({
   'beforeSend': function (xhr) {xhr.setRequestHeader("Accept", "text/javascript");
                                 $('#ajax-indicator').show();},
   'complete': function() {$('#ajax-indicator').hide();}
 });

jQuery.fn.getWithAjax = function(){
    this.live('click', function (event){
     event.preventDefault();
     
		    $.get(this.href,{},function(response){
		 	   $('#response').html(response)
        
		    })
     });
 };


 $(function(){  
   $('a.dialogLink, a.ajaxLink').getWithAjax();
   $('.clickableRow').live('click', clickableRowHandler);
   $('a.navLink').click(function(event){
       var $link = $(this);
       event.preventDefault();
     
		   $.get(this.href,{},function(response){
		 	   $('#response').html(response)
         $('li.navLink').removeClass("current");         
         $link.parent().addClass("current");
     
		    })
     });
})

function clickableRowHandler(){
    var objId = $(this).data('object_id');
    var objType = $(this).data('object_type')
    
		    $.get(objType+"/"+objId,{},function(response){
		 	   $('#response').html(response)
        
		    })
  }

  function initFancyTable() {
    $('#searchForm').submit(function () {
     
     $.get(this.action, $(this).serialize(), null, 'script');
     return false;
   });
   $('#searchField').observe_field(0.5,function(){
     $(this.form).submit();
   });

}