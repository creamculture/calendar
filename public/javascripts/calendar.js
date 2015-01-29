
$(document).ready(function(){

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
        if(ev.important){
            tpl += '<div class="marker"></div>';
        }
        //tpl += '<i class="fa fa-circle"></i>';
        tpl += '<span class="ev-data"><i class="fa fa-circle"></i>'+'<strong>'+ev.title+'</strong>'+'<br>'+ev.location+'</span>';
        tpl += '</div>';
        return tpl;
    };

    //Get events from server and create calendar with events
    $.get("/event", function(data){

        //Create list of events 
        var eventsList = [];
        for( var i=0; i<data.length; i++ ){
            var curEvent = {
                title: data[i].name,
                start: new Date( data[i].startDate),
                end: new Date(data[i].endDate),
                location: data[i].address
                // important: true
            }
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
    			alert( calEvent.title );
    		},
            events: eventsList,
            eventRender: function(event, element) {
                element.find('.fc-event-inner').html(evTpl(event));
            }
        });
            

    });
});