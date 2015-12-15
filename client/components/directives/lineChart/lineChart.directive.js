'use strict';

angular.module('sasaWebApp')
  .directive('lineChart', function () {
    return {
      templateUrl: '',
      restrict: 'EA',
      scope:{lineData:'='},
      link: function (scope, element, attrs) {
        var x_label=scope.lineData['distribution_data']['x_label']
        var y_label=scope.lineData['distribution_data']['y_label']
        var data= scope.lineData['distribution_data']['data']
        // var x_label = scope.lineData['distribution_data'];
          // var data=[{"y0":4,"x0":1},
          //   {"y0":7,"x0":2},
          //   {"y0":2,"x0":3},
          //   {"y0":5,"x0":4},
          //   {"y0":6,"x0":5},
          //   {"y0":11,"x0":6},
          //   {"y0":1,"x0":7},
          //   {"y0":1,"x0":8},
          //   {"y0":4,"x0":9},
          //   {"y0":6,"x0":10},
          //   {"y0":6,"x0":11},
          //   {"y0":7,"x0":12},
          //   {"y0":13,"x0":13},
          //   {"y0":7,"x0":14},
          //   {"y0":6,"x0":15},
          //   {"y0":13,"x0":16}]
        // var data=scope.lineData['distribution_data']['data']
            

          var margin = {top: 30, right: 20, bottom: 35, left: 50},
          width = 350 - margin.left - margin.right,
          height = 320 - margin.top - margin.bottom;

          // var parseDate = d3.time.format("%d-%b-%y").parse;

          var x = d3.scale.linear().range([0, width]);
          var y = d3.scale.linear().range([height, 0]);

          var xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom")
              .ticks(10);

          var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left")
              .ticks(10);

          var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d) {
                return "<strong>"+y_label+":</strong> <span>" + d.y0.toFixed(3)+ "</span>";
              })


          var valueline = d3.svg.line()
              .x(function(d) { return x(d.x0); })
              .y(function(d) { return y(d.y0); });

          // // Define the ttip for the tooltip
          // var ttip = d3.select(element[0]).append("ttip") 
          //     .attr("class", "tooltip")       
          //     .style("opacity", 0);

              
          var svg = d3.select(element[0])
              .append("svg")
                  .attr("viewBox", "0 0 350 320") 
                  // .attr("width", width + margin.left + margin.right)
                  // .attr("height", height + margin.top + margin.bottom)
              .append("g")
                  .attr("transform", 
                        "translate(" + margin.left + "," + margin.top + ")");


          svg.call(tip);
          
          // function for the x grid lines
          function make_x_axis() {
              return d3.svg.axis()
                  .scale(x)
                  .orient("bottom")
                  .ticks(10)
          }

          // function for the y grid lines
          function make_y_axis() {
            return d3.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(10)
          }


          // Scale the range of the data
          x.domain([0, d3.max(data, function(d) { return d.x0; })]);
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

          // Add the valueline path.
          svg.append("path")
              .attr("class","line")
              .attr("d", valueline(data));

          // Add the scatterplot
          svg.selectAll("dot")  
              .data(data)     
              .enter().append("circle")               
              .attr("r", 5)   
              .attr("cx", function(d) { return x(d.x0); })     
              .attr("cy", function(d) { return y(d.y0); }) 
              .attr("fill","#005290")  
              .on('mouseover', tip.show)
              .on('mouseout', tip.hide);

          // Add the X Axis
          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          // Add the Y Axis
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
          }
        };
      });