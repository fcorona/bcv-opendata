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

var transformData = function(data, type){
  if(type=='Alfabético'){
    return data;
  }
  var data = Math.round(data*100) / 100;
  if(type=='Tasa'){
    return parseFloat(data).toLocaleString();
  }
  if(type=='Porcentual'){
    data = parseFloat(data*100).toLocaleString();
    
    return data+'%'; 
  }
  if(type=='Númerico'){
    return parseFloat(data).toLocaleString();
  }

  return parseFloat(data).toLocaleString();
}

var valuesAlpha = {
  'AAA': 10,
  'AA+': 9,
  'AA-': 8,
  'AA': 7,
  'BBB': 6,
  'BB+': 5,
  'BBB-': 4,
  'CCC': 3,
  'DD': 2,
  'E': 1
};
var loadIndicator = function(indicatorId){
  d3.json('/api/datas/' + indicatorId + '?key=asdasdas', function(data) {

    var margin = {top: 20, right: 30, bottom: 30, left: 40},
        width = 700 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var y = d3.scale.linear()
          .range([height, 0]);

    var chart = d3.select("#chart")
          .attr('width', 300)
          .attr('height', 500);
        //.attr("width", width + margin.left + margin.right)
        //.attr("height", height + margin.top + margin.bottom);

    var the_data = [];
    var the_domain = [];

    chart.selectAll('g').remove();

    the_data=[];
    the_domain=[];

    for(var year in data.datas){
      if(data.datas[year]){
        if(data.measureType=='Alfabético'){
          the_data.push(valuesAlpha[data.datas[year]]);
        }else{
          the_data.push(data.datas[year]);
        }
        the_domain.push(year);
      }
    }

    var max = d3.max(the_data);
    console.log(data.measureType=='Porcentual', data.measureType)
    if(data.measureType=='Porcentual' && max<1)
      y.domain([0, 1.1]);
    else if(data.measureType=='Alfabético')
      y.domain([0, 11]);
    else
      y.domain([0, max*1.1]);

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
    console.log('bar', bar);

    bar.append("rect")
      .attr("y", function(d){
        var value = data.datas[d];
        if(data.measureType=='Alfabético'){
          value = valuesAlpha[value];
        }
        return y(value); //225 de colchon
      })
      .attr("height", function(d){
        var value = data.datas[d];
        if(data.measureType=='Alfabético'){
          value = valuesAlpha[value];
        }
        return height -y(value);
      })
      .attr("width", x.rangeBand() - 5);

    bar.append("text")
      .attr("x", x.rangeBand() / 3) 
      .attr("y", function(d) { return y(data.datas[d]) - 20; })
      .attr("dy", ".75em")
      .text(function(d){
        
        return transformData(data.datas[d], data.measureType);
      });


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
  d3.json('/api/datas/'+ dataset +'?key=asdasd', function(datasets) {
    loadIndicator(dataset);
    //d3.selectAll('#dimensionSelect option').remove();
    /*for(var i=0; i<dataset.dimensions.length; i++){
      d3.select('#dimensionSelect').append('option').attr('value', dataset.dimensions[i].dimensionId).html(dataset.dimensions[i].name);
    }
    loadDimension(dataset.dimensions[0].dimensionId);
    */
  });  
};