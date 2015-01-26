// In createEventTab

//Turn input box into a datepicker
$('#dateInput').datepicker({
    format: "dd/mm/yyyy"
});  

//Handle sending form with new event info to server
$("#createEventSubmit").click(function(){
	if( $("#eventNameInput").val()=="" || $("#addressInput").val()=="" 
			|| $("#cityInput").val()=="" ||  $("#big").val() ){
		alert("All fields must be completed");
	}
	else{
		$.post( "/event", $( "#formCreateEvent" ).serialize(), function(data){
			alert(data); 
		});
	}
});