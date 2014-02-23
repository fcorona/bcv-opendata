/** dimension
* Esta funcion se encarga de revisar el tamaño del exporador y asignar el tamaño del lienzo de acuerdo
* a sus dimensiones.
*/

function dimension(){
	margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 39.5},
    width = (window.innerWidth)- margin.right,
    height = (window.innerHeight) - margin.top - margin.bottom;
}
var ancho_actual = window.innerWidth;
var alto_actual = window.innerHeight;
var nuevo_ancho, nuevo_alto, porcentaje_cambio_ancho, porcentaje_cambio_alto,conjunto_rect;
var cx_aux, cy_aux, y_aux ;
//redimension de la ventana
window.onresize=function() {
	dimension();
	var lienzo_aux = d3.select('#chart');
	var g_all = d3.selectAll('g');
	var g_aux, g_attr_transform;
	nuevo_ancho = window.innerWidth;		
	nuevo_alto = window.innerHeight;
	porcentaje_cambio_ancho = (nuevo_ancho) / ancho_actual;
	porcentaje_cambio_alto = (nuevo_alto) / alto_actual;
	conjunto_rect = d3.selectAll('rect');
	
	for(var i = 0; i<conjunto_rect[0].length;i++){
		rect_aux = d3.select(conjunto_rect[0][i]);
		g_aux = d3.select(g_all[0][i]);		
		cx_aux = rect_aux.attr('width');			
		cx_aux = cx_aux*porcentaje_cambio_ancho;
		cy_aux = rect_aux.attr('height');			
		cy_aux = cy_aux*porcentaje_cambio_alto;
		y_aux = rect_aux.attr('y');
		y_aux = y_aux*porcentaje_cambio_alto;
		rect_aux.attr('width',cx_aux);			
		rect_aux.attr('height',cy_aux);
		rect_aux.attr('y',y_aux);
		g_attr_transform = g_aux.attr('transform');
		g_attr_transform = g_attr_transform.split("(")[1];
		g_attr_transform = parseInt(g_attr_transform.split(",")[0])*porcentaje_cambio_ancho;
		g_aux.attr("transform","translate("+g_attr_transform+",0)");

	}
	ancho_actual = nuevo_ancho;
	alto_actual = nuevo_alto;
};
