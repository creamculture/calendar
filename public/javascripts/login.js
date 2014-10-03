$(document).ready(function() {
	$("#registrationSubmit").click(function(){
		if( $("#inputUserName").val()=="" || $("#inputPassword").val()=="" ||
			$("#reinputPassword").val()=="" || $("#inputUserEmail").val()=="" ){
			alert("All fields must be completed");
			return;
		}
		if( $("#inputPassword").val() != $("#reinputPassword").val() ){
			alert("Passwords must match");
			return;
		}
		//validate email
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if( !re.test($("#inputUserEmail").val()) ){
			alert("Invalid Email");
			return;
		}
		else{
			$.post( "/register", $( "#formAddUser" ).serialize(), function(data){
				alert(data); 
				$.get("/");
			});
		}
	});
	
});