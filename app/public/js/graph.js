var chart = d3.select("#chart")
  .append("svg")
  .attr("width", 800)
  .attr("height", 400);

var createRect = function(value, index){
  chart.append("rect")
    .style("stroke", "gray")
    .style("fill", "white")
    .attr("x", index*30)
    .attr("y", 390-value)
    .attr("width", 30)
    .attr("height",value)
    .on("mouseover", function(){d3.select(this).style("fill", "aliceblue");})
    .on("mouseout", function(){d3.select(this).style("fill", "white");});
};

var url = '/api/datasets/iicv/Entorno macroeconómico/Producción/Tasa de crecimiento del PIB?key=asdasdas';
d3.json(url, function(data) {
  var cont = 0;
  data.datas.forEach(function(d){
    createRect(d.value*100, cont++);
  });
});