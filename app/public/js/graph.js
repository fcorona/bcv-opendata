d3.select('#dimensionSelect').on('change', function(){
  var dimensionId = d3.select('#dimensionSelect').node().value;
  loadDimension(dimensionId);
});

d3.select('#categorySelect').on('change', function(){
  var categoryId = d3.select('#categorySelect').node().value;
  loadCategory(categoryId);
});

d3.select('#indicatorSelect').on('change', function(){
  var indicatorId = d3.select('#indicatorSelect').node().value;
  loadIndicator(indicatorId);
});

var loadDimension = function(dimensionId){
  d3.json('/api/dimensions/' + dimensionId + '?key=asdasd', function(dimension) {
    d3.selectAll('#categorySelect option').remove();
    for(var i=0; i<dimension.categories.length; i++){
      d3.select('#categorySelect').append('option').attr('value', dimension.categories[i].categoryId).html(dimension.categories[i].name);
    }
    loadCategory(dimension.categories[0].categoryId);
  });
}

var loadCategory = function(categoryId){
  d3.json('/api/categories/' + categoryId + '?key=asdasd', function(category) {
    d3.selectAll('#indicatorSelect option').remove();
    for(var i=0; i<category.datas.length; i++){
      d3.select('#indicatorSelect').append('option').attr('value', category.datas[i]['_id']).html(category.datas[i].name);
    }
    loadIndicator(category.datas[0]['_id']);
  });
}

var loadIndicator = function(indicatorId){
  d3.json('/api/datas/' + indicatorId + '?key=asdasdas', function(data) {

    var margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 39.5},
        width = ((window.innerWidth)- margin.right)*0.8,
        height = ((window.innerHeight) - margin.top - margin.bottom)*0.75;

    /*var margin = {top: 20, right: 30, bottom: 30, left: 40},
        width = 1024 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;*/

    var y = d3.scale.linear()
          .range([height, 0]);

    var chart = d3.select("#chart")
          .attr('width', '80%')
          .attr('height', '75%');
        //.attr("width", width + margin.left + margin.right)
        //.attr("height", height + margin.top + margin.bottom);

    var the_data=[];
    var the_domain=[];

    chart.selectAll('g').remove();

    the_data=[];
    the_domain=[];

    for(var year in data.datas){
      if(data.datas[year]){
        the_data.push(data.datas[year]);
        the_domain.push(year);
      }
    }

    var max = d3.max(the_data);
    y.domain([0, max]);

    var barWidth = 30;
    var x = d3.scale.ordinal()
          .domain(the_domain)
          .rangeRoundBands([0, width - 100], .1);

    var xAxis = d3.svg.axis()
         .scale(x)
         .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10, "");

    var bar = chart.selectAll("g")
          .data(the_domain)
          .enter().append("g")
          .attr("transform", function(d) { return "translate(" + x(d) + ",0)"; });

    bar.append("rect")
       .attr("y", function(d) { return (y(data.datas[d]) + 225)*0.8; })
       .attr("height", function(d) { return (height/2 - y(data.datas[d])); })
       .attr("width", x.rangeBand() - 5);

    bar.append("text")
       .attr("x", x.rangeBand() / 4)
       .attr("y", function(d) { return y(data.datas[d]) + 200 ; })
       .attr("dy", ".75em")
       .text(function(d) { return Math.round(data.datas[d]*100) / 100; });


    chart.append("g")
         .attr("class", "x axis")
         .attr("transform", "translate(0," + height + ")")
         .call(xAxis);

    chart.append("g")
         .attr("class", "y axis")
         .call(yAxis)
         .append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", 6)
         .attr("dy", ".71em")
         .style("text-anchor", "end")
         .text(data.measureType);

    d3.select('#dataset').html(data.dataset);
    d3.select('#dimension').html(data.dimension);
    d3.select('#category').html(data.category);

    d3.select('#name').html(data.name);
    d3.select('#description').html(data.description);
    d3.select('#measureType').html(data.measureType);
    d3.select('#source').html(data.source);
    d3.select('#coverage').html(data.coverage);
    d3.select('#period').html(data.period);

  });
}


var initGraph = function(dataset){
  d3.json('/api/datasets/' + dataset + '?key=asdasd', function(dataset) {
    d3.selectAll('#dimensionSelect option').remove();
    for(var i=0; i<dataset.dimensions.length; i++){
      d3.select('#dimensionSelect').append('option').attr('value', dataset.dimensions[i].dimensionId).html(dataset.dimensions[i].name);
    }
    loadDimension(dataset.dimensions[0].dimensionId);
  });  
};