'use strict';

angular.module('sasaWebApp')
  .directive('lineChart', function () {
    return {
      templateUrl: '',
      restrict: 'EA',
      scope:{lineData:'='},
      link: function (scope, element, attrs) {
        scope.$watch("lineData",function(newValue,oldValue) {
          d3.select(element[0]).select("#line").remove();
          var x_label=scope.lineData['distribution_data']['x_label']
          var y_label=scope.lineData['distribution_data']['y_label']
          var data= scope.lineData['distribution_data']['data']
          var title= scope.lineData['name']
              
          //Getting screen size for responsive design 
          var screenWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;

          var margin = {top: 30, right: 20, bottom: 35, left: 80},
          width = screenWidth/4 - margin.left - margin.right,
          height = screenWidth/4 - margin.top - margin.bottom;

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
                return "<strong>"+y_label+":</strong> <span>" + d.y0.toFixed(0)+ "</span>";
              })


          var valueline = d3.svg.line()
              .x(function(d) { return x(d.x0); })
              .y(function(d) { return y(d.y0); });

  
              
          var svg = d3.select(element[0]).append("svg")
                    .attr("id","line")
                    // .attr("viewBox", "0 0 350 320") 
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
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
              .text(title);
          });
        }
      };
    });