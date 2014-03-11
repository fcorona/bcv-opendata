
var transformData = function(data, type){
  if(type=='Alfabético'){
    return data;
  }
  if(type=='Porcentual'){
    data = parseFloat(data*100).toFixed(2).toLocaleString();
    return data+'%'; 
  }
  if(data%1 === 0){
    return parseInt(data).toLocaleString();
  }
  return parseFloat(data).toFixed(2).toLocaleString();
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

var chart = undefined;
var oldWidth = 0;
var x = undefined;
var the_domain = [];

var loadIndicator = function(indicatorId){
  d3.json('/api/datas/' + indicatorId + '?key=asdasdas', function(data) {
    chart = d3.select("#chart");
    var clientWidth = parseInt(chart.style('width'));
    var clientHeight = clientWidth*0.6;
    var marginOffset = clientWidth/20;
    oldWidth = clientWidth;

    var margin = {top: marginOffset, right: marginOffset, bottom: marginOffset, left: 66},
        width = clientWidth - margin.right,
        height = clientHeight - margin.top - margin.bottom;

    var y = d3.scale.linear()
          .range([height, marginOffset]);

    chart.attr('height', clientHeight);

    var the_data = [];


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
    if(data.measureType=='Alfabético')
      y.domain([0, 11]);
    else
      y.domain([0, max*1.1]);

    x = d3.scale.ordinal()
          .domain(the_domain)
          .rangeRoundBands([66, width], .2);

    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<span style='color:steelblue'>" + transformData(data.datas[d], data.measureType) + "</span>";
    });

    chart.call(tip);
    var xAxis = d3.svg.axis()
         .scale(x)
         .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10, "");
    if(data.measureType=='Porcentual'){
      yAxis.tickFormat(d3.format(".0%"));
    }

    var bar = chart.selectAll("g")
          .data(the_domain)
          .enter().append("g")
          .attr("transform", function(d) { return "translate(" + x(d) + ",0)"; });

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
        return height - y(value);
      })
      .attr("class", "bar")
      .attr("width", x.rangeBand() - marginOffset/8)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);



    chart.append("g")
         .attr("class", "x axis")
         .attr("transform", "translate(-4," + height + ")")
         .call(xAxis);

    chart.append("g")
         .attr("class", "y axis")
         .attr("transform", "translate(66," + 0 + ")")
         .call(yAxis);


  });
}


var initGraph = function(dataset){
  loadIndicator(dataset);
};
