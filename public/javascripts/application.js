 jQuery.ajaxSetup({
   'beforeSend': function (xhr) {xhr.setRequestHeader("Accept", "text/javascript")}
 });

jQuery.fn.getWithAjax = function(){
    this.live('click', function (event){
     event.preventDefault();
     $('#ajax-indicator').show();
		    $.get(this.href,{},function(response){
		 	   $('#response').html(response)
         $('#ajax-indicator').hide();
		    })
     });
 };


 $(function(){  
   $('a.dialogLink, a.ajaxLink').getWithAjax();
   $('.clickableRow').live('click', clickableRowHandler);
   $('a.navLink').click(function(event){
       var $link = $(this);
       event.preventDefault();
       $('#ajax-indicator').show();
		   $.get(this.href,{},function(response){
		 	   $('#response').html(response)
         $('li.navLink').removeClass("current");         
         $link.parent().addClass("current");
         $('#ajax-indicator').hide();
		    })
     });
})

function clickableRowHandler(){
    var objId = $(this).data('object_id');
    var objType = $(this).data('object_type')
    $('#ajax-indicator').show();
		    $.get(objType+"/"+objId,{},function(response){
		 	   $('#response').html(response)
         $('#ajax-indicator').hide();
		    })
  }

  function initFancyTable() {
    $('#searchForm').submit(function () {
     $('#ajax-indicator').show();
     $.get(this.action, $(this).serialize(), function(){$('#ajax-indicator').hide();}, 'script');
     return false;
   });
   $('#searchField').observe_field(0.5,function(){
     $(this.form).submit();
   });

}