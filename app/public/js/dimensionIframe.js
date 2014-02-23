function dimension_iframe(){
	console.log("entra");
	var ancho_actual = window.innerWidth;
	var alto_actual = window.innerHeight;
	var iframe = d3.select("#content-graphid");
	iframe.attr('height', 4000 /*alto_actual*/);
	iframe.attr('width', ancho_actual*0.7);
}
window.onload=dimension_iframe;