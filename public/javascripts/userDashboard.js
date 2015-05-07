// In createEventTab ////////////////////////////////////////////////////////////////

//Turn input boxes into a datepicker
$('#startDateInput').datepicker({
    format: "mm/dd/yyyy"
});  
$('#endDateInput').datepicker({
    format: "mm/dd/yyyy"
});  


//Handle sending form with new event info to server
$("#createEventSubmit").click(function(){
	if( $("#eventNameInput").val()=="" || $("#addressInput").val()=="" 
			|| $("#cityInput").val()=="" ||  $("#big").val()=="" || 
			$("#startDateInput").val()=="" || $("#endDateInput").val()==""
		|| $("#eventPhotoInput").val()==""){
		alert("All fields must be completed");
	}
	else{
		$.post( "/event", $( "#formCreateEvent" ).serialize())
			.done( function(data) {
				$('body').animate({ scrollTop: 0 }, 0);
				window.location.reload();
			} )
			.fail( function(response) {
				alert(response.responseText);
			});
	}
});

// In profile tab ////////////////////////////////////////////////////////////////
$("#profilePic").click(function(){
	
});
