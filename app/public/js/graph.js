var chart = d3.select('#chart')
  .append('svg')
  .attr('width', 800)
  .attr('height', 200);

var createRect = function(value, index){
  chart.append('rect')
    .style('stroke', 'gray')
    .style('fill', 'white')
    .attr('x', index*30)
    .attr('y', 190-value)
    .attr('width', 30)
    .attr('height',value)
    .on('mouseover', function(){d3.select(this).style('fill', 'aliceblue');})
    .on('mouseout', function(){d3.select(this).style('fill', 'white');});
};

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

var dataset = 'iicv';
d3.json('/api/datasets/' + dataset + '?key=asdasd', function(dataset) {
  d3.selectAll('#dimensionSelect option').remove();
  for(var i=0; i<dataset.dimensions.length; i++){
    d3.select('#dimensionSelect').append('option').attr('value', dataset.dimensions[i].dimensionId).html(dataset.dimensions[i].name);
  }
  loadDimension(dataset.dimensions[0].dimensionId);
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
    var cont = 0;
    chart.selectAll('rect').remove();
    for(var year in data.datas){
      createRect(data.datas[year]*100, cont++);
    }
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