
$(document).ready(function(){

	var currentCalEvent;
	/**
	 * De acuerdo al psd y a mi interpretacion, existen las siguientes clasificaciones de eventos:
	 * 1. Evento pasado
	 *    - icono redondo de color verde
	 *    - fuente tachada
	 *    - color opaco
	 * 2. Evento importante o que se quiere enmarcar
	 *    - icono redondo de color rojo
	 *    - icono tipo marcador
	 * 3. Evento del dia actual (TODAY)
	 *    - fuente de color azul
	 *
	 * Propiedades inherentes a todos los eventos
	 *    - Title
	 *    - Location
	 *    - past (this feature will be use for knowing which events should be painted with opacity, the developer will know how to replace this functionality)
	 */
	var evTpl = function(ev){
		var classes = 'dc-event';
		classes += (ev.important)?' ev-important':'';

		//sustituir aki con la logica para saber si es pasado el evento o no
		classes += (ev.past)?' ev-past':'';
		//sustituir aki con la logica para saber si es el dia de hoy
		classes += (ev.today)?' ev-today':'';

		var tpl = '<div class="'+classes+'">';
		if(ev.attending) {
			tpl += '<div id="' + ev._id + '" class="marker"></div>';
		} else{
			tpl += '<div id="' + ev._id + '"></div>';
		}
		//tpl += '<i class="fa fa-circle"></i>';
		//tpl += '<span class="ev-data"><i class="fa fa-circle"></i>'+'<strong>'+ev.title+'</strong>'+'</span>';
		var imgUrl = '/api/getEventPhoto/' + ev._id;
		tpl += '<span class="ev-data" style="margin-left:-2px; height:100px;background-image: url(' +imgUrl+ ');background-size: 163px 100px;background-repeat: repeat-x" />';
		tpl += '</div>';
		return tpl;
	};
	$.get("/getUserName", function(username){
		$("#username").val(username);
		//Get events from server and create calendar with events
		$.get("/event", function(data){

			//Create list of events
			var eventsList = [];
			for( var i=0; i<data.length; i++ ){
				var curEvent = {
					_id: data[i]._id,
					title: data[i].name,
					description: data[i].description,
					start: new Date( data[i].startDate),
					end: new Date(data[i].endDate),
					location: data[i].address,
					creator: data[i].creator,
					attendees: data[i].attendees,
					attending: userInAttendees(username, data[i].attendees),
					important: true
				};
				eventsList.push( curEvent );
			}

			//Create calendar using list of events
			$('#calendar').fullCalendar({
				header: {
					left: 'title',
					center: '',
					right: 'prev,next'
				},
				eventClick: function(calEvent, jsEvent, view) {
					currentCalEvent = calEvent;
					
					$("#eventTitle").text(calEvent.title);
					$("#eventDescription").text(calEvent.description);
					$("#eventLocation").text(calEvent.location);
					$("#eventStart").text(calEvent.start.toString().slice(0, 15));
					if(calEvent.end) {
						$("#eventEnd").text(calEvent.end.toString().slice(0, 15));
					} else {
						$("#eventEnd").text(calEvent.start.toString().slice(0, 15));
					}
					$("#eventImg").attr("src", '/api/getEventPhoto/' + calEvent._id);

					if(calEvent.creator === username) {
						$("#deleteEvent").removeAttr("disabled");
					} else {
						$("#deleteEvent").attr("disabled", "disabled");
					}

					$('#eventModal').modal('show');

					if(calEvent.attending){
						$("#attendEvent").html('Not Attend');
					} else {
						$("#attendEvent").html('Attend');
					}
				},
				events: eventsList,
				eventRender: function(event, element) {
					element.find('.fc-event-inner').html(evTpl(event));
				}
			});
		});
	});

	$("#attendEvent").click(function(){
		$.post( "/toggleEventAttendance", {eventId: currentCalEvent._id}, function(data){
			currentCalEvent.attending = data.attending;
			if(data.attending){
				$("#attendEvent").html('Not Attend');
				$("#" + currentCalEvent._id).addClass("marker");
			} else {
				$("#attendEvent").html('Attend');
				$("#" + currentCalEvent._id).removeClass("marker");
			}
		});
	});

	$("#deleteEvent").click(function(){
		$.post( "/deleteEvent", {eventId: currentCalEvent._id}, function(data){
			window.location.reload();
		});
	});
});

function userInAttendees(username, attendees){
	var ret = false;
	if(attendees) {
		attendees.forEach(function (attendee) {
			if (username === attendee) {
				ret = true
			}
		});
	}
	return ret;
}