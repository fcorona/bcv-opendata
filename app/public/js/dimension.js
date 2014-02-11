/** dimension
* Esta funcion se encarga de revisar el tamaño del exporador y asignar el tamaño del lienzo de acuerdo
* a sus dimensiones.
*/
function dimension(){
	//se limpia el lienzo:
	//$('.lienzo').empty();
	margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 39.5},
    width = (window.innerWidth)- margin.right,
    height = (window.innerHeight) - margin.top - margin.bottom;
}
var ancho_actual = window.innerWidth;
var alto_actual = window.innerHeight;
var nuevo_ancho, nuevo_alto, porcentaje_cambio_ancho, porcentaje_cambio_alto, radio_actual,conjunto_circle;
var circle_aux, cx_aux, cy_aux ;
//redimension de la ventana
$(window).resize(function() {
	dimension();
	var lienzo_aux = $('#chart');
	nuevo_ancho = window.innerWidth;		
	nuevo_alto = window.innerHeight;
	porcentaje_cambio_ancho = (nuevo_ancho) / ancho_actual;
	porcentaje_cambio_alto = (nuevo_alto) / alto_actual;
	conjunto_circle = $('circle').select();
	for(var i = 0; i<conjunto_circle.length;i++){
		circle_aux = $(conjunto_circle[i]);
		radio_actual = circle_aux.attr('r');
		circle_aux.attr('r',radio_actual*porcentaje_cambio_ancho);			
		cx_aux = circle_aux.attr('cx');			
		cx_aux = cx_aux*porcentaje_cambio_ancho;
		cy_aux = circle_aux.attr('cy');			
		cy_aux = cy_aux*porcentaje_cambio_alto;
		circle_aux.attr('cx',cx_aux);			
		circle_aux.attr('cy',cy_aux);
	}
	ancho_actual = nuevo_ancho;
	alto_actual = nuevo_alto;
});