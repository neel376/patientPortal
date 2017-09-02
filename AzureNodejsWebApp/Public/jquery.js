$(function(){
	
	$('#wrapper').on('click','a', function() {
		alert("CLICKED");
		//$.post('/testtwilio');

		/* Act on the event */
	});
	$('.box1').blur(function(){
    	if( !$(this).val() ||!$('.box2').val() || !$('.box3').val() ) {
           	$('.button').addClass('disabled');
		}else{
    		$('.button').removeClass("disabled");
    	}
	});
	$('.box2').blur(function(){
    	if( !$(this).val() ||!$('.box1').val() || !$('.box3').val() ) {
           	$('.button').addClass('disabled');
		}else{
    		$('.button').removeClass("disabled");
    	}
	});
	$('.box3').blur(function(){
    	if( !$(this).val() ||!$('.box1').val() || !$('.box2').val() ) {
           $('.button').addClass('disabled');
	  	}else{
    		$('.button').removeClass("disabled");
    	}
	});
	$('.box3').keypress(function(event) {
		if( !$(this).val() ||!$('.box1').val() || !$('.box2').val() ) {
           $('.button').addClass('disabled');
		}else{
    	$('.button').removeClass("disabled");
    	}	
	});
	$('.card').on('click', function(){
		$('.main-navigation').toggleClass('open');
		

	 	$('.button').addClass('disabled');
	});
 

	$('.button').on('click', function(){
	 	var text = $('.box1').val()
	 	var text2 = $('.box2').val()
	 	var text3 = $('.box3').val()
	 	if(text === '' || text2 === '' || text3 === ''){
	 	
	 	}else{
	 		$('.main-navigation').toggleClass('open');
	 		$('.box1').val('');
		 	$('.box2').val('');
	 		$('.box3').val('');
	  		$('.button').addClass('disabled');
		}
	});
	$('.names').on('click', ".name2",function(e){
		 $('.infocard').fadeIn("fast");
		 $('.side-navigation').removeClass('open');
		//angular.element('#MainController').scope().returnPat();
		
	});
	$('.send').on('click', function(){ 	
	 		$('.textBox').val('');	
	});
	$('.container').on('click', function(){
		$('.infocard').fadeOut("fast");
	});
	$('.cancel').on('click', function(){
		$('.main-navigation').toggleClass('open');
	});
	$(".main").on('click', function(){
		$('.side-navigation').removeClass('open');
	});	
	$(".container").on('click', function(){
		$('.side-navigation').removeClass('open');
	});

	$(".nametext").on('click', function(){
		$('.side-navigation').removeClass('open');
	});
	$(".name2").on('click', function(){
		$('.side-navigation').removeClass('open');
	});
	$(".body").on('click', function(){
		$('.side-navigation').removeClass('open');
	});
	$(".listpatients").on('click', function(){
		$('.side-navigation').removeClass('open');
	});
	$('.search').on('click', function(){
		$('.side-navigation').addClass('open');
	});
	$('.submit').click(function() {
	
   	window.location.reload(true);
	
});
$('input:file').on("change", function() {
    $('input:submit').prop('disabled', !$(this).val()); 
});
   
 

});
