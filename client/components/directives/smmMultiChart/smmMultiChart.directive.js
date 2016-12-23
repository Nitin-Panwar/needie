'use strict';

angular.module('sasaWebApp')
  .directive('smmMultiChart', ['$window', '$timeout', '$filter', function($window, $timeout, $filter) {
  return {
    scope: {
      data: '=',
      container:'@',
      handle: '=',
      options:'=',
      measures:'=',
      refresh: '=',
    },
    restrict: 'EA',
    replace: true,

    link:function(scope, element, attrs){
      var goals=[];
      // scope.colors = ["blue","red","yellow","green"]
      //Creating div id on the fly
      var randomId = "x" + Math.floor(Math.random()*10000);
      d3.select(element[0]).append('div').attr("id",randomId)
      scope.$watch('options',function(){
        //Creating array of goals
        goals=[];
        for (var i = 0; i < scope.measures.length; i++) {
          if(scope.measures[i].goal && scope.measures[i].active){
            if(scope.options.xAxis[0]===scope.measures[i].goal.scale){
                goals[i]={ "y" : scope.measures[i].goal.value, "color" :"black"}
            }
          }
        };
        //Appending created div id 
        scope.container =randomId
        if(scope.data == null || scope.data === undefined || scope.data.length==0)
          return;
        if(scope.container == null || scope.container == undefined)
          return;
        // if(!scope.stackBarChartObject ){
        if(scope.options.changeXaxis===true){
          scope.stackBarChartObject
            .data(scope.options.yAxis.length==2?scope.data[0]:scope.data)
            .xAxis(scope.options.xAxis)
            .y2Data(scope.options.yAxis.length==2?scope.data[1]:null)
            .hLines(goals)
            .colorMapping(scope.options.colorMapping)();
          scope.stackBarChartObject.renderChart();
          scope.options.changeXaxis=false;

        }
        else{
          drawChart()
        }  
      },true);
      scope.control = scope.handle || {}
      scope.$watch('data',function(){
        //Creating array of goals
        goals=[];
        for (var i = 0; i < scope.measures.length; i++) {
          if(scope.measures[i].goal && scope.measures[i].active){
            if(scope.options.xAxis[0]===scope.measures[i].goal.scale){
                goals[i]={ "y" : scope.measures[i].goal.value, "color" : "black"}
            }
          }
        };
        //Appending created div id 
        scope.container =randomId
        if(scope.data == null || scope.data === undefined || scope.data.length==0)
          return;
        if(scope.container == null || scope.container == undefined)
          return;
        if(!scope.stackBarChartObject)
          drawChart()
        else
        {
          scope.stackBarChartObject
            .data(scope.options.yAxis.length==2?scope.data[0]:scope.data)
            .xAxis(scope.options.xAxis)
            .y2Data(scope.options.yAxis.length==2?scope.data[1]:null)
            .hLines(goals)
            .colorMapping(scope.options.colorMapping)();
          scope.stackBarChartObject.renderChart();
        }
      },true);

      scope.$watch('measures',function(){
        //Creating array of goals
        goals=[];
        for (var i = 0; i < scope.measures.length; i++) {
          if(scope.measures[i].goal && scope.measures[i].active){
            if(scope.options.xAxis[0]===scope.measures[i].goal.scale){
                goals[i]={ "y" : scope.measures[i].goal.value, "color" : "black"}
            }
          }
        };
        //Appending created div id 
      scope.container =randomId
        if(scope.data == null || scope.data === undefined || scope.data.length==0)
          return;
        if(scope.container == null || scope.container == undefined)
          return;
        if(!scope.stackBarChartObject)
          drawChart()
        else
        {
          scope.stackBarChartObject
            .data(scope.options.yAxis.length==2?scope.data[0]:scope.data)
            .xAxis(scope.options.xAxis)
            .y2Data(scope.options.yAxis.length==2?scope.data[1]:null)
            .hLines(goals)
            .colorMapping(scope.options.colorMapping)();
          scope.stackBarChartObject.renderChart();
        }
      },true);
      scope.$watch('refresh',function(){
        //Creating array of goals
        goals=[];
        for (var i = 0; i < scope.measures.length; i++) {
          if(scope.measures[i].goal && scope.measures[i].active){
            if(scope.options.xAxis[0]===scope.measures[i].goal.scale){
                goals[i]={ "y" : scope.measures[i].goal.value, "color" : "black"}
            }
          }
        };
        //Appending created div id 
      scope.container =randomId
        if(scope.data == null || scope.data === undefined || scope.data.length==0)
          return;
        if(scope.container == null || scope.container == undefined)
          return;
        if(!scope.stackBarChartObject)
          drawChart()
        else
        {
          scope.stackBarChartObject
            .data(scope.options.yAxis.length==2?scope.data[0]:scope.data)
            .xAxis(scope.options.xAxis)
            .y2Data(scope.options.yAxis.length==2?scope.data[1]:null)
            .hLines(goals)
            .colorMapping(scope.options.colorMapping)();
          scope.stackBarChartObject.renderChart();
        }
      },true);
      

      function drawChart()
      {
        if(scope.container == null || scope.container == undefined)
          return;

        if(scope.data == null || scope.data === undefined || scope.data.length==0)
          return;

        if(!scope.stackBarChartObject)
        {
          scope.stackBarChartObject = plotChart__();

          //scope.stackBarChartObject.subscribe()
          //.width(parseInt(d3.select('#'+scope.container).style('width')))
          //.height(parseInt(d3.select('#'+scope.container).style('height')))
        }

        //set values
        if(scope.options.yAxis.length == 2)
        {
          if(scope.data[0]!=undefined)
            scope.stackBarChartObject.data(scope.data[0]) //main data
          if(scope.data[1]!=undefined)
            scope.stackBarChartObject.y2Data(scope.data[1]) //main data
        }
        else
        {
          if(scope.data!=undefined)
            scope.stackBarChartObject.data(scope.data) //main data
        }

        if(scope.options.xAxis!=undefined)
          scope.stackBarChartObject.xAxis(scope.options.xAxis)

        if(scope.options.yAxis!=undefined)
          scope.stackBarChartObject.yAxis(scope.options.yAxis)

        if(scope.options.zAxis!=undefined)
          scope.stackBarChartObject.zAxis(scope.options.zAxis)

        if(scope.options.series!=undefined)
          scope.stackBarChartObject.series(scope.options.series)

        // if(scope.goal!=undefined){
        //   console.log("inside if",scope.goal)
        //   scope.stackBarChartObject.hLines([
        //     { "y" : scope.goal, "color" : 'red'}])
        // }

        if(scope.options.vLines!=undefined)
          scope.stackBarChartObject.vLines(scope.options.vLines)

        if(scope.options.vLines!=undefined)
          scope.stackBarChartObject.vLines(scope.options.vLines)

        if(scope.options.chartType!=undefined)
          scope.stackBarChartObject.chartType(scope.options.chartType)

        //colors will repeat
        if(scope.options.colorScheme!=undefined)
          scope.stackBarChartObject.colorScheme(scope.options.colorScheme)

        //specific series color
        if(scope.options.colorMapping!=undefined)
          scope.stackBarChartObject.colorMapping(scope.options.colorMapping)

        if(scope.options.bands!=undefined)
          scope.stackBarChartObject.bands(scope.options.bands)

        if(scope.options.bandColors!=undefined)
          scope.stackBarChartObject.bandColors(scope.options.bandColors)

        if(scope.options.dualAxis!=undefined)
          scope.stackBarChartObject.dualAxis(scope.options.dualAxis)

        if(scope.options.lineMarker!=undefined)
          scope.stackBarChartObject.lineMarker(scope.options.lineMarker)

        if(scope.options.innerRadius!=undefined)
          scope.stackBarChartObject.innerRadius(scope.options.innerRadius)

        if(scope.options.yAxisHidden!=undefined)
          scope.stackBarChartObject.yAxisHidden(scope.options.yAxisHidden)

        if(scope.options.showLabels!=undefined)
          scope.stackBarChartObject.showLabels(scope.options.showLabels)

        if(scope.options.donutLabel!=undefined)
          scope.stackBarChartObject.donutLabel(scope.options.donutLabel)

        if(scope.options.yMin!=undefined)
          scope.stackBarChartObject.yMin(scope.options.yMin)

        if(scope.options.yMax!=undefined)
          scope.stackBarChartObject.yMax(scope.options.yMax)

        if(scope.options.ticks!=undefined)
          scope.stackBarChartObject.ticks(scope.options.ticks)

        if(scope.options.legendWidth!=undefined)
          scope.stackBarChartObject.legendWidth(scope.options.legendWidth)

        if(scope.options.legendLeft!=undefined)
          scope.stackBarChartObject.legendLeft(scope.options.legendLeft)
        if(scope.options.showLegend!=undefined){
          if(scope.options.series !== "")
            scope.stackBarChartObject.showLegend(scope.options.showLegend)
          else
            scope.stackBarChartObject.showLegend(false)
        }

        if(scope.options.legendFilter!=undefined)
          scope.stackBarChartObject.legendFilter(scope.options.legendFilter)

        if(scope.options.showTooltip!=undefined)
          scope.stackBarChartObject.showTooltip(scope.options.showTooltip)

        if(scope.options.showDetailTooltip!=undefined)
          scope.stackBarChartObject.showDetailTooltip(scope.options.showDetailTooltip)

        if(scope.options.showGridlines!=undefined)
          scope.stackBarChartObject.showGridlines(scope.options.showGridlines)

        if(scope.options.timeAxis!=undefined)
          scope.stackBarChartObject.timeAxis(scope.options.timeAxis)

        if(scope.options.timeFormat!=undefined)
          scope.stackBarChartObject.timeFormat(scope.options.timeFormat)

        if(scope.options.replaceTicks!=undefined)
          scope.stackBarChartObject.replaceTicks(scope.options.replaceTicks)

        if(scope.options.xLabels!=undefined)
          scope.stackBarChartObject.xLabels(scope.options.xLabels)

        //default circle. polygon, diamond,circle,triangle-up,triangle-down,square,cross
        if(scope.options.shape!=undefined)
          scope.stackBarChartObject.shape(scope.options.shape)

        //default 0.2
        if(scope.options.barGap!=undefined)
          scope.stackBarChartObject.barGap(scope.options.barGap)

        //style can be changes in css
        if(scope.options.shapeLine!=undefined)
          scope.stackBarChartObject.shapeLine(scope.options.shapeLine)

        if(scope.options.orderList!=undefined)
          scope.stackBarChartObject.orderList(scope.options.orderList)

        if(scope.options.tooltipSeries!=undefined)
          scope.stackBarChartObject.tooltipSeries(scope.options.tooltipSeries)

        if(scope.options.tooltipFields!=undefined)
          scope.stackBarChartObject.tooltipFields(scope.options.tooltipFields)

        if(scope.options.eventHandler!=undefined)
          scope.stackBarChartObject.eventHandler(scope.options.eventHandler)

        if(scope.options.eventHandler!=undefined)
          scope.stackBarChartObject.eventHandler(scope.options.eventHandler)

        if(scope.options.axisLabels!=undefined)
          scope.stackBarChartObject.axisLabels(scope.options.axisLabels)


        /*********build Chart object*********/
        if(!scope.chartObject || scope.options.orderList)
        {
          scope.chartObject = (scope.stackBarChartObject
            .container(scope.container)
            //.width(parseInt(d3.select('#'+scope.container).style('width')))
            //.height(parseInt(d3.select('#'+scope.container).style('height')))
          )();

          //scope.chartObject.subscribe()
        }
        if(!scope.chartObject || scope.options.showLabels === true || scope.options.showLabels === false)
        {
          scope.chartObject = (scope.stackBarChartObject
            .container(scope.container)
            //.width(parseInt(d3.select('#'+scope.container).style('width')))
            //.height(parseInt(d3.select('#'+scope.container).style('height')))
          )();

          //scope.chartObject.subscribe()
        }
        if(scope.options.orderList){
          scope.stackBarChartObject
              .orderList(scope.options.orderList)
            scope.stackBarChartObject.orderList();
        }
      }

      //drawChart();

    }//link end

  }//return end
}])//directive end
