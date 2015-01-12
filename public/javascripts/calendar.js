/**
 * Created by kensey on 12/4/2014.
 */
$(document).ready(function(){
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

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

    $('#calendar').fullCalendar({
        header: {
            left: 'title',
            center: '',
            right: 'prev,next'
        },
        events: [
            {
                title: 'iTunes Festival',
                start: new Date(y, m, 1),
                end: new Date(y, m, 1),
                location: 'sdasdsd',
                important: true,
                past:true
            },
            {
                title: 'iTunes Festival',
                start: new Date(y, m, 1),
                location: 'sdasdsd',
                past:true
            },
            {
                title: 'iTunes Festival',
                start: new Date(y, m, 5),
                location: 'sdasdsd',
                today:true
                //past:true
            },
            {
                title: 'iTunes Festival',
                start: new Date(y, m, 10),
                location: 'bleh',
                //past:true
            },
            {
                title: 'iTunes Festival',
                start: new Date(y, m, 25),
                location: 'blue',
                important: true,
                //past:true
            }
        ],
        eventRender: function(event, element) {
            element.find('.fc-event-inner').html(evTpl(event));
        }
    });
});