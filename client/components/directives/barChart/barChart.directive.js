'use strict';

angular.module('sasaWebApp')
  .directive('barChart', function () {
    return {
      template: '<div></div>',
      restrict: 'EA',
      scope:{barData:'='},
      link: function (scope, element, attrs) {
        var x_label=scope.barData['distribution_data']['x_label']
        var y_label=scope.barData['distribution_data']['y_label']
        var data= scope.barData['distribution_data']['data']
        
        var margin = {top: 30, right: 20, bottom: 35, left: 50},
          width = 350 - margin.left - margin.right,
          height = 320 - margin.top - margin.bottom;

      		// var data=[{"y0":4,"x0":1},
      		// {"y0":7,"x0":2},
      		// {"y0":2,"x0":3},
      		// {"y0":5,"x0":4},
      		// {"y0":6,"x0":5},
      		// {"y0":11,"x0":6},
      		// {"y0":1,"x0":7},
      		// {"y0":1,"x0":8},
      		// {"y0":4,"x0":9},
      		// {"y0":6,"x0":10},
      		// {"y0":6,"x0":11},
      		// {"y0":7,"x0":12},
      		// {"y0":13,"x0":13},
      		// {"y0":7,"x0":14},
      		// {"y0":6,"x0":15},
      		// {"y0":13,"x0":16}]

          // var data=scope.barData['distribution_data']['data']


      		var x = d3.scale.ordinal()
      		    .rangeRoundBands([0, width], .1);

      		var y = d3.scale.linear()
      		    .range([height, 0]);

      		var xAxis = d3.svg.axis()
      		    .scale(x)
      		    .orient("bottom")
      		    .ticks(5);

      		var yAxis = d3.svg.axis()
      		    .scale(y)
      		    .orient("left")
      		    .ticks(5);

      		var svg = d3.select(element[0]).append("svg")
              .attr("viewBox", "0 0 400 370") 
      		    // .attr("width", width + margin.left + margin.right)
      		    // .attr("height", height + margin.top + margin.bottom)
      		  .append("g")
      		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      	    // function for the x grid lines
                function make_x_axis() {
                    return d3.svg.axis()
                        .scale(x)
                        .orient("bottom")
                        .ticks(5)
                }

                // function for the y grid lines
                function make_y_axis() {
                  return d3.svg.axis()
                      .scale(y)
                      .orient("left")
                      .ticks(5)
                }

      		  x.domain(data.map(function(d) { return d.x0; }));
      		  y.domain([0, d3.max(data, function(d) { return d.y0; })]);

      		  // Draw the x Grid lines
                svg.append("g")
                    .attr("class", "grid")
                    .attr("transform", "translate(0," + height + ")")
                    .call(make_x_axis()
                        .tickSize(-height, 0, 0)
                        .tickFormat("")
                    )

                // Draw the y Grid lines
                svg.append("g")            
                    .attr("class", "grid")
                    .call(make_y_axis()
                        .tickSize(-width, 0, 0)
                        .tickFormat("")
                    )


      		  svg.append("g")
      		      .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

      		  svg.append("g")
      		      .attr("class", "y axis")
      		      .call(yAxis);

      	      // Add the text label for the X axis
                svg.append("text")
                    .attr("transform",
                          "translate(" + (width/2) + " ," + 
                                         (height+margin.bottom) + ")")
                    .style("text-anchor", "middle")
                    .text(x_label);

                // Add the text label for the Y axis
                svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", -margin.left)
                    .attr("x", margin.top - (height / 2))
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text(y_label);

                // Add the title
                svg.append("text")
                    .attr("x", (width / 2))     
                    .attr("y", 0 - (margin.top / 2))
                    .attr("text-anchor", "middle")
                    .style("font-size", "16px")
                    .text(y_label+" vs "+x_label);
      		    

      		  svg.selectAll(".bar")
      		      .data(data)
      		    .enter().append("rect")
      		      .attr("class", "bar")
      		      .attr("x", function(d) { return x(d.x0); })
      		      .attr("width", x.rangeBand())
      		      .attr("y", function(d) { return y(d.y0); })
      		      .attr("height", function(d) { return height - y(d.y0); })
      		      .style("fill","#4682B4");
      	}
}
});