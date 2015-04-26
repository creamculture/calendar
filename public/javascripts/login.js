//Client-side
$(document).ready(function() {

	$('#login').fancybox();
    $('#close-form').on('click',function(){
        $.fancybox.close();
    });
	
	//Activates splash page carousel
	$('#myCarousel').carousel({
		interval: 5000 //changes the speed
	})

	/*$("#userLogin").submit(function(){
		$.post( "/login", $( "#userLogin" ).serialize(), function(resp){
			switch(resp){
				case "DB_FAIL":
				alert("Error connecting to database");
				break;
			case "LOGIN_FAIL":
				alert("Login failed: Check credentials");
				break;
			case "SUCCESS":
				$.get("/dashboard");
				break;
			}
		});
		return false;
	});*/

});