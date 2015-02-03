//Client-side
$(document).ready(function() {

	$('#login').fancybox();
    $('#close-form').on('click',function(){
        $.fancybox.close();
    });

    $("#userLoginForm").submit(function(){
	    $.post( "/login", $( "#userLoginForm" ).serialize(), function(resp){
			switch(resp){
				case "DB_FAIL":
					alert("Error connecting to database");
					break;
				case "LOGIN_FAIL":
					alert("Login failed: Check credentials");
					break;
				case "SUCCESS":
					$.cookie("username", $("#username").val());
					location.href = "/dashboard";
					break;
			}
		});
		return false;
	});
});