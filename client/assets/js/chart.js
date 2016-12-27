(function(){
  plotChart__ = function()
  {
    var elem,chartBands,chart1,legend1,svg,x,x1,y=[],z=[],s=[],labels=[],sVLines,tickCount=0,filterValues;
    var watcher_ = d3.watcher(500),widthWatcherID=null,heightWatcherID=null;
    var container=null,data=[],xAxis=null,yAxis=[],zAxis=[],series=[],y2Data=[],hLines=[],vLines=[],chartType=['line'],colorScheme=[],donutLabel="",
      bands=null,bandColors=[],dualAxis=false,lineMarker=false,innerRadius=0,yAxisHidden=false,showLabels=false,ticks=null,colorMapping=[],showGridlines=true,
      categLabels=[],yMin=null, yMax=null,legendWidth="100%",legendLeft=false,showLegend=true,legendFilter=true,tooltipObj=null,detailtooltipObj=null,
      showTooltip=true,showDetailTooltip=[],timeAxis=false,timeFormat="%m/%d/%Y",xLabels=[],shape="circle",barGap=0.2,shapeLine=false,
      tooltipFields=[],tooltipSeries=[],orderList=[],autoRotateLabel=true,eventHandler=null,aggrStackLabels=false,axisLabels=true;
    var chartMargins = {left:55, top:30, right:30, bottom:100}  

    function plotChart_()
    {
      chartMargins.bottom = axisLabels?chartMargins.bottom:chartMargins.bottom-20;
      widthWatcherID = watcher_.Subscribe(container,'width', function () {
        plotChart_.resize();
      });

      heightWatcherID = watcher_.Subscribe(container,'height', function () {
        plotChart_.resize();
      });

      if(xAxis==null)
        console.log("Cannot plot no X Axis");

      if(yAxis.length==0)
        console.log("Cannot plot no Y Axis");

      d3.select("#"+container).select("svg").remove();
      svg = dimple.newSvg("#"+container,"100%","400px");

      svg.selectAll(".hLines").remove();
      //svg.selectAll(".vLines").remove();

      addBands();

      plotChart1();
      chart1.hasTimeAxis = timeAxis;

      tickCount = setYTicks();

      if(yAxis.length > 1 && !dualAxis)
      {
        y[0].ticks = tickCount;
        plotChart2();
        //chart1.draw();
      }
      else if(yAxis.length > 1 && dualAxis)
      {
        y[0].ticks = tickCount;
        y[1].ticks = tickCount;
        //chart1.draw();
      }
      else
      {
        y[0].ticks = tickCount;
        //chart1.draw();
      }

      //add legend
      if(showLegend)
        legend1 = chart1.addLegend((legendLeft)?0:chart1.x, 10, legendWidth, "75%", "left",s);

      if(eventHandler != undefined)
        s[0].addEventHandler("click", eventHandler);

      if(!axisLabels)
      {
        if(x!=undefined)
          x.title = ""
        y[0].title = "";
        if(dualAxis)
          y[1].title = "";
      }
      else
      {
        if(x!=undefined)
          x.title = undefined
        y[0].title = undefined;
        if(dualAxis)
          y[1].title = undefined;
      }


      chart1.draw(800);

      setMargins();      
      
      chart1.setMargins(chartMargins.left, chartMargins.top, chartMargins.right, chartMargins.bottom);
      
      chart1.draw(800);

      //change legend shape
      replaceLegendShapes();
      replaceCategories();
      //console.log(categLabels);
      if(x!=undefined)
        x.categLabels = categLabels;

      if(showLegend && legendFilter)
      {
        filterValues = dimple.getUniqueValues(data, series==null?xAxis:series);
        legendInteraction(chart1,legend1);
      }

      defineTooltip();

      // chart1.axes[0].shapes.call(
      //    d3.svg.axis()
      //     .orient("bottom")
      //     .scale(chart1.axes[0]._scale)
      //     .tickValues(data.map(function(d,i){
      //         return ["Q2'2015"]
      //       })
      //     )
      // )


      //chart1.draw(800);
      return plotChart_;
    };

    function defineTooltip()
    {
      if(showTooltip)
      {
        if(showDetailTooltip.length > 0)
        {
          if(detailtooltipObj == null)
            detailTooltip();

          chart1.detailTooltip = detailtooltipObj;
          chart1.detailTooltipdata = getTooltipData();
          chart1.tooltipSeries = tooltipSeries;
          chart1.tooltipFields = tooltipFields;
          chart1.xField = xAxis;

          var detailTip = {"bar":false,"point":false,"shape":false};
          if(showDetailTooltip.indexOf("bar") > -1)
            detailTip["bar"] = true;
          if(showDetailTooltip.indexOf("shape") > -1)
            detailTip["shape"] = true;
          if(showDetailTooltip.indexOf("point") > -1)
            detailTip["point"] = true;

          chart1.detailTip = detailTip;
        }
        else
        {
          if(tooltipObj == null)
            basicTooltip();

          chart1.basicTooltip = tooltipObj;
          chart1.tooltipFields = tooltipFields;
        }
      }
    }

    function setMargins()
    {
      if(!showLegend) return;

      var yMax=0;
      legend1.shapes.selectAll("text").forEach(function (s){
            yMax=parseInt(yMax)<parseInt(s[0].getAttribute("y"))?s[0].getAttribute("y"):yMax
      });

      chartMargins.top = d3.round(parseInt(yMax))+25;
    }

    function setYTicks()
    {
      var tck = d3.scale.linear();
      var tck1 = tck.domain([-200,1000]).range([1,9]);
      var val = parseInt(tck1(chart1._heightPixels()-100));
      val=val+2;
      if(ticks == null)
        return val;
      else
        return ticks;
      //return 8;
    }

    function plotChart1()
    {
      chart1 = new dimple.chart(svg, data);
      // Fix the margins
      //left, top, right, bottom
      chart1.setMargins(chartMargins.left, chartMargins.top, chartMargins.right, chartMargins.bottom);

      chart1._showTooltip = showTooltip;

      if(colorScheme.length>0)
      {
        chart1.defaultColors = [];
        for(var c=0;c<colorScheme.length;c++)
          chart1.defaultColors.push(new dimple.color(colorScheme[c]));
      }
      assignColors();
      switch(chartType[0])
      {
        case "line":
          plotLine(chart1,0);
          break;
        case "area":
          plotArea(chart1,0);
          break;
        case "bar":
          plotBar(chart1,0);
          break;
        case "horzbar":
          plotHorzBar(chart1,0);
          break;
        case "bubble":
          plotBubble(chart1,0);
          break;
        case "pie":
          plotPie(chart1,0);
          break;
        case "shape":
          plotShape(chart1,0);
          break;
        default:
      }

      if(dualAxis)
      {
        switch(chartType[1])
        {
          case "line":
            plotLine(chart1,1);
            break;
          case "area":
            plotArea(chart1,1);
            break;
          case "bar":
            plotBar(chart1,1);
            break;
          case "bubble":
            plotBubble(chart1,1);
            break;
          case "shape":
            plotShape(chart1,1);
            break;
          default:
        }
      }

      s[0].lineMarkers = lineMarker;
      if(x!=undefined)
      {
        x.showGridlines = showGridlines;
        x.autoRotateLabel = autoRotateLabel;
      }
      y[0].showGridlines = showGridlines;

      // if(chartType[0] != "pie" && x!=undefined)
      // {
      //   if(orderList.length > 0)
      //   {
      //     x.addOrderRule(orderList);
      //   }
      //   else
      //   {
      //     x.addOrderRule(xAxis);
      //   }
      // }

      /* ****** Modified by KChug/IKhurana ********
       Below code will allow us to sort according to Y-Axis
      */
      if(chartType[0] != "pie" && x!=undefined)
      {

        if(orderList.length > 0)
        {
          x.addOrderRule(yAxis[0],orderList[1]);
        }
        else
        {
          x.addOrderRule(xAxis);

        }


      }

      /* ***** Modification ENDS ***** */
      
      if(orderList.length > 0)
        s[0].addOrderRule(orderList)

      chart1.draw(800);

      overrideYScale();
      addHLines();
      addVLines();
      chart1.draw(800);


    }

    function plotChart2()
    {
      switch(chartType[1])
      {
        case "line":
          plotLine(chart1,1);
          break;
        case "area":
          plotArea(chart1,1);
          break;
        case "bar":
          plotBar(chart1,1);
          break;
        case "bubble":
          plotBubble(chart1,1);
          break;
        case "shape":
          plotShape(chart1,1);
          break;

        default:
      }

      //if(x!=undefined)
      //    x.hidden = true;

      if(!dualAxis)
        y[1].hidden = true

    }

    function replaceLegendShapes()
    {
      if(!showLegend || chartType[1]!="shape") return;

      var shapesize = function(size){
        return ''+(size/2)+',0 '+size+','+(size/2)+' '+(size/2)+','+size+' 0,'+(size/2)+'';
      }

      var categ = dimple.getUniqueValues(y2Data, series==null?xAxis:series);

      legend1.shapes.selectAll("rect").forEach(function (s){
        for(var c=0;c<categ.length;c++)
        {
          if(s[0].getAttribute("id").indexOf(categ[c]) > -1)
          {
            var x=s[0].getAttribute("x");
            x=parseInt(x)+parseInt(shape=="polygon"?5:10);
            var y=s[0].getAttribute("y")-parseInt(shape=="polygon"?5:0);
            legend1.shapes
              .append(shape=="polygon"?"polygon":"path")
              .attr("d", d3.svg.symbol()
                .size( 100)
                .type( shape ))
              .attr("points", shapesize(13))
              .attr("transform", function (d) {
                return "translate(" +
                  x + "," +
                  y + ")"})
              .style("fill",s[0].style.fill)
            d3.select(s[0]).remove();
            //legend1.shapes.selectAll(".dimple-custom-legend-key .dimple-"+categ[c].replace(/_/g, '-').toLowerCase()).remove();
          }
        }
      });

    }

    function reDraw()
    {
      svg.selectAll(".hLines").remove();
      //svg.selectAll(".vLines").remove();
      svg.selectAll(".labelConfig").remove();
      svg.selectAll(".donutlabelConfig").remove();

      //reset min and max
      y[0].overrideMin = null;
      y[0].overrideMax = null;

      chart1.draw(800);

      overrideYScale();

      addHLines();
      //addVLines();
      chart1.draw(800);

      setTimeout(function(){
        replaceCategories();
        if(x!=undefined)
          x.categLabels = categLabels;

      }, 1000);

    }

    function setLegendOpacity()
    {
      legend1.shapes.selectAll("rect").forEach(function (e){
        if(e[0]!=undefined)
        {
          if(filterValues.indexOf(e[0].getAttribute("id")) == -1)
            d3.select(e[0]).style("opacity",0.2)
        }
      })
    }

    function legendInteraction(chart,legend)
    {
      if(chart==null) return;

      chart.legends = [];

      legend.shapes.selectAll("rect")
        .on("click", function (e) {
          var hide = false;
          var newFilters = [];
          filterValues.forEach(function (f) {
            if (f.toString() === e.aggField.slice(-1)[0].toString()) {
              hide = true;
            } else {
              newFilters.push(f);
            }
          });

          if (hide) {
            d3.select(this).style("opacity", 0.2);
          } else {
            newFilters.push(e.aggField.slice(-1)[0].toString());
            d3.select(this).style("opacity", 0.8);
          }
          filterValues = newFilters;
          seriesValues = filterValues;
          chart.data = dimple.filterData(data, series==null?xAxis:series, filterValues);

          if(chartType.length > 1 && !dualAxis)
          {
            if(shapeLine)
            {
              s[1].data = [];
              s[2].data = [];
            }
            else
            {
              s[1].data = [];
            }
          }
          reDraw();
          if(chartType.length > 1 && !dualAxis)
          {
            if(shapeLine)
            {
              s[1].data = y2Data;
              s[2].data = y2Data;
            }
            else
            {
              s[1].data = y2Data;
            }
          }
          reDraw();
        });

    }

    function plotLine(chart,axis)
    {
      if(axis==0)
      {
        if(timeAxis)
          x = chart.addTimeAxis("x", xAxis, "%m/%d/%Y", timeFormat);
        else
          x = chart.addCategoryAxis("x", xAxis);
      }
      y[axis] = chart.addMeasureAxis("y", yAxis[axis]);

      if(dualAxis)
        s[axis] = chart.addSeries(series==xAxis?null:series, dimple.plot.line, [x,y[axis]]);
      else
        s[axis] = chart.addSeries(series==xAxis?null:series, dimple.plot.line);

      if(showLabels)
        addPointLabels();
    }

    function plotArea(chart,axis)
    {
      if(axis==0)
      {
        if(timeAxis)
          x = chart.addTimeAxis("x", xAxis, "%m/%d/%Y", timeFormat);
        else
          x = chart.addCategoryAxis("x", xAxis);
      }
      y[axis] = chart.addMeasureAxis("y", yAxis[axis]);
      if(dualAxis)
        s[axis] = chart.addSeries(series==xAxis?null:series, dimple.plot.area, [x,y[axis]]);
      else
        s[axis] = chart.addSeries(series==xAxis?null:series, dimple.plot.area);

      if(showLabels)
        addPointLabels();
    }

    function plotBar(chart,axis)
    {
      if(axis==0)
      {
        if(timeAxis)
          x = chart.addTimeAxis("x", xAxis, "%m/%d/%Y", timeFormat);
        else
          x = chart.addCategoryAxis("x", xAxis);

      }
      y[axis] = chart.addMeasureAxis("y", yAxis[axis]);
      if(dualAxis)
        s[axis] = chart.addSeries(series==null?xAxis:series, dimple.plot.bar, [x,y[axis]]);
      else
        s[axis] = chart.addSeries(series==null?xAxis:series, dimple.plot.bar);

      s[axis].barGap=barGap;

      if(showLabels)
      {

        if(!aggrStackLabels)
          addRectLabels(s[0]);
        else
          addStackedLabels();
      }
    }

    function plotHorzBar(chart,axis)
    {
      x = chart.addMeasureAxis("x", xAxis);
      if(timeAxis)
        y[axis] = chart.addTimeAxis("y", yAxis, "%m/%d/%Y", timeFormat);
      else
        y[axis] = chart.addCategoryAxis("y", yAxis);
      s[axis] = chart.addSeries(series, dimple.plot.bar);

      s[axis].barGap=barGap;

      if(showLabels)
        addRectLabels(s[0]);
    }

    function plotPie(chart,axis)
    {
      y[axis] = chart.addMeasureAxis("p", yAxis[axis]);
      s[axis] = chart.addSeries(series, dimple.plot.pie);

      if(innerRadius>0)
      {
        s[axis].innerRadius = innerRadius;
        addDonutLabel();
      }

      if(showLabels)
        addPieLabels();
    }

    function plotBubble(chart,axis)
    {
      if(axis==0)
      {
        //if(timeAxis)
        //    x = chart.addTimeAxis("x", xAxis, "%m/%d/%Y", timeFormat);
        //else
        x = chart.addCategoryAxis("x", xAxis);
      }

      y[axis] = chart.addMeasureAxis("y", yAxis[axis]);

      if(zAxis[axis] != undefined)
        z[axis] = chart.addMeasureAxis("z", zAxis[axis]);
      if(dualAxis)
        s[axis] = chart.addSeries(series==null?xAxis:series, dimple.plot.bubble, [x,y[axis]]);
      else
      {
        if(axis==1)
        {
          y[axis].overrideMin = y[0]._min;
          y[axis].overrideMax = y[0]._max;
        }
        s[axis] = chart.addSeries(series==null?xAxis:series, dimple.plot.bubble);
      }

      if(showLabels)
        addPointLabels();
    }

    function plotShape(chart,axis)
    {
      if(shapeLine)
        plotShapeLine();

      if(axis==0)
      {
        //if(timeAxis)
        //    x = chart.addTimeAxis("x", xAxis, "%m/%d/%Y", timeFormat);
        //else
        x = chart.addCategoryAxis("x", xAxis);
      }

      y[axis] = chart.addMeasureAxis("y", yAxis[axis]);

      if(zAxis[axis] != "")
        z[axis] = chart.addMeasureAxis("z", zAxis[axis]);
      if(dualAxis)
        s[axis] = chart.addSeries(series==null?xAxis:series, dimple.plot.shape, [x,y[axis]]);
      else
      {
        if(axis==1)
        {
          y[axis].overrideMin = y[0]._min;
          y[axis].overrideMax = y[0]._max;
        }
        s[axis] = chart.addSeries(series==null?xAxis:series, dimple.plot.shape);
      }
      if(axis>0)
        s[axis].data = y2Data;

      s[axis].shape = shape;

      //addPointLabels();
    }

    function plotShapeLine()
    {
      s[2] = chart1.addSeries(series, dimple.plot.line);
      s[2].data = y2Data;
      s[2].addEventHandler("mouseover", function () {});
      s[2].addEventHandler("mouseleave", function () {});
      linesStyle(s[2],"shapeLines")
    }

    function replaceCategories()
    {
      if(xLabels.length==0) return;
      //categLabels = [];
      x.categLabels = [];
      
      if(categLabels.length==0)
      { 
        categLabels = [];
        d3.select("#"+container).selectAll('.dimple-axis-x .dimple-custom-axis-label').attr('text', function(d,i) {
          categLabels[d3.select(this).text()] = xLabels[i];
          return d3.select(this).text(xLabels[i])
        });
      }
      else
      {
        d3.select("#"+container).selectAll('.dimple-axis-x .dimple-custom-axis-label').attr('text', function(d,i) {
          if(categLabels[d3.select(this).text()] != undefined)
            return d3.select(this).text(categLabels[d3.select(this).text()])
        });
      }
    }

    function addBands()
    {
      if(bands==null) return;

      chartBands = new dimple.chart(svg, bands);
      chartBands._showTooltip = true;
      chartBands.setMargins(chartMargins.left, chartMargins.top, chartMargins.right, chartMargins.bottom);

      chartBands.defaultColors = [];
      for(var c=0;c<bandColors.length;c++)
        chartBands.defaultColors.push(new dimple.color(bandColors[c]));

      var x1 = chartBands.addCategoryAxis("x", "BANDS");
      var y1 = chartBands.addMeasureAxis("y", "BANDVALUE");

      svgTemp = dimple.newSvg("#"+container,"0%","0%")
      svgTemp.attr("id","tempSVG")
      var chartTemp = new dimple.chart(svgTemp, data);
      var xTemp = chartTemp.addCategoryAxis("x",xAxis)
      var yTemp = chartTemp.addMeasureAxis("y",yAxis[0])
      var sTemp = chartTemp.addSeries(series==xAxis?null:series,dimple.plot.line)
      chartTemp.draw();

      d3.select("#tempSVG").remove();

      if(yMin != null)
      {
        y1.overrideMin = yMin;//yMin < yTemp._min? yMin : yTemp._min;
        y1.overrideMax = yMax;//yMax > yTemp._max? yMax : yTemp._max;
      }
      else
      {
        y1.overrideMin = yTemp._min;
        y1.overrideMax = yTemp._max;
      }

      x1.hidden = true;
      y1.hidden = true;

      var s = chartBands.addSeries("BANDNAME", dimple.plot.bar);
      s.addOrderRule("BANDNAME")
      s.barGap = 0;
      //removeStrokes(s);
      chartBands.draw(800);
      //chart1.draw(800);
    }

    function overrideYScale()
    {
      //if(yAxis.length <=1 || dualAxis) return;

      //chart 2 data check
      var chart2min=null, chart2max=null;

      if(yAxis.length > 1 && !dualAxis)
      {
        chart2min = d3.min(y2Data,function(d){return d[yAxis[1]];})
        chart2max = d3.max(y2Data,function(d){return d[yAxis[1]];})
      }

      if(yMin!=null && yMax!=null)
      {
        y[0].overrideMin = yMin;
        y[0].overrideMax = yMax;
   
      }
      else if(chart2min!=null && chart2max!=null)
      {
        console.log(yMax,chart2min)
        y[0].overrideMin = chart2min < y[0]._min ? chart2min : y[0]._min;
        y[0].overrideMax = chart2max > y[0]._max ? chart2max : y[0]._max;
      }
      //hlines data check
      //
      hLines.forEach(function (d,i){
        if(d.y>=y[0]._max){
            y[0].overrideMax = d.y > y[0].overrideMax ? d.y : y[0].overrideMax;
          }
      });
      y[0].ticks=tickCount;
      chart1.draw(800)

    }
    
    function addHLines(chart)
    {
    //  console.log(svg.selectAll("text"))
      var temp=0;
      if(chartType[0]=="pie") return;
      hLines.forEach(function (d,i){
        svg.append("line")
          .attr("x1", chart1._xPixels())
          .attr("y1", y[0]._scale(d.y))
          .attr("x2", chart1._xPixels() + chart1._widthPixels())
          .attr("y2", y[0]._scale(d.y))
          .style("stroke", d.color)
          .attr("dy", "5em")
          .attr("class", "hLines");
          // .attr('text','i am here');
        if(temp==0){
          svg.append("text")
            .attr("x", chart1._xPixels()/2 + chart1._widthPixels()/2)
            .attr("y", y[0]._scale(d.y)+-10)
            .attr("dy", ".35em")
            .attr("text-anchor", "start")
            .style("fill", 'black')
            .style("margin-to",'120px')
            .text("Goal value: "+d.y);  
           
        }
      });
// svg.append("text")
//     .attr("transform", "translate(" + (width+3) + "," + y[0]._scale(d.y) + ")")
//     .attr("dy", ".35em")
//     .attr("text-anchor", "start")
//     .style("fill", "steelblue")
//     .text("Close");
      /*if(chartType[0]=="pie") return;
       var obj = {};
       if(sHLines==undefined)
       {
       hLines.forEach(function (d){console.log(d);d["DT"] ="1/1/1801";})
       sHLines = chart1.addSeries("hLineName", dimple.plot.line);
       sHLines.data = hLines;
       }
       linesStyle(sHLines,"hLines")   */
    }

    function addVLines()
    {
      if(chartType[0]=="pie") return;

      /*vLines.forEach(function (d,i){console.log(
       svg.append("line")
       .attr("x1", x._scale(d.x))
       .attr("x2", x._scale(d.x))
       .attr("y1", chart1._yPixels())
       .attr("y2", chart1._yPixels() + chart1._heightPixels())
       .style("stroke", d.color)
       .attr("class", "vLines")
       });*/

      //if(sVLines == undefined)
      //{
      var yLineVal = chart1.addPctAxis("y", "vLineValue");
      yLineVal.hidden = true;

      sVLines = chart1.addSeries("vLineName", dimple.plot.area, [x, yLineVal]);
      sVLines.data = vLines;

      sVLines.addEventHandler("mouseover", function () {});
      sVLines.addEventHandler("mouseleave", function () {});
      //}
      linesStyle(sVLines,"vLines")

    }

    function assignColors()
    {
      if(colorMapping==undefined) return;
      
      Object.keys(colorMapping).forEach(function(key) {
        chart1.assignColor(key,colorMapping[key]);
      })
    }

    function linesStyle(s,css)
    {
      s.afterDraw = function (shape, data) {
        var shp = d3.select(shape)
        shp.attr("class",css)

      }
    }

    function removeStrokes(s)
    {
      s.afterDraw = function (shape, data) {
        var s = d3.select(shape)
        s.style("stroke-width", 0)
      }
    }

    function addStackedLabels()
    {
      xlbl = chart1.addCategoryAxis("x", xAxis);
      ylbl = chart1.addMeasureAxis("y", yAxis[0]);
      zlbl = chart1.addMeasureAxis("z", 0);
      slbl = chart1.addSeries(null, dimple.plot.bubble);
      xlbl.hidden=true;
      ylbl.hidden=true;

      addPointLabels();
      //chart1.series.pop();
    }

    
   function addRectLabels(s)
    {
     // var temp=[]
      var temp=0
      s.afterDraw = function (shape, data) {

        //var id = shape["id"]
        var s = d3.select(shape),
          rect = {
            x: parseFloat(s.attr("x")),
            y: parseFloat(s.attr("y")),
            width: parseFloat(s.attr("width")),
            height: parseFloat(s.attr("height"))
          };
        if (rect.height >= 8){
          //temp.push(id);
          // Add a text label for the value
          svg.append("text")
            // Position in the centre of the shape (vertical position is
            // manually set due to cross-browser problems with baseline)
            .attr("x", rect.x + rect.width / 2)
            .attr("y", rect.y -12)  //rect.y -12/rect.y + rect.height / 2+3.5
            .attr("class","labelConfig")
            // Centre align
            .style("text-anchor", "middle")
            .style("fill", "#111")
            //#696969
            //.style("font-size", "10px")
            //.style("font-family", "sans-serif")
            // Make it a little transparent to tone down the black
            .style("opacity", 0.5)
            // Format the number
            //.text(d3.format(",.1f")(data.yValue / 1000) + "k")
            //.text(d3.round((data.yValue/1000))+"k");
            .text(d3.round(chartType[0]=="bar"?data.yValue:data.xValue));
        }
       temp++;
        
      }

    }

    function addPointLabels()
    {
      s[0].afterDraw = function (shp, d, i) {
        var shapes = svg.selectAll("circle");
           
        for (var i = 0; i < shapes[0].length; i++) {
          svg.append("text")
            .attr("x", parseFloat(shapes[0][i].getAttribute("cx")))
            .attr("y", parseFloat(shapes[0][i].getAttribute("cy")) - 10)
            .style("text-anchor", "middle")
            //.style("font-size", "10px")
            //.style("font-family", "sans-serif")
            .attr("class","labelConfig")
            .text(shapes[0][i].getAttribute("helptext"))
            //.text(d3.round((shapes[0][i].getAttribute("helptext")/1000))+"k")
            .style("opacity", checkOverlap);
        }
      }
    }

    function checkOverlap()
    {
      var overlap=false,rect1,rect2;
      rect2 = this.getBoundingClientRect();
      for (var i = 0; i < labels.length && !overlap; i++) {
        rect1 = labels[i].getBoundingClientRect();
        overlap = !(
        rect1.top > rect2.bottom ||
        rect1.right < rect2.left ||
        rect1.bottom < rect2.top ||
        rect1.left > rect2.right
        );
      }
      labels[labels.length] = this;
      return overlap || !showLabels ?0:1;
    }

    function addPieLabels()
    {
      svg.selectAll(".labelConfig").remove();

      s[0].afterDraw = function(shape, data) {
        var bbox, ctm;
        ctm = shape.getCTM();
        bbox = shape.getBBox();
        return svg.append("text")
          .style("opacity", (showLabels)?1:0)
          .attr("class","labelConfig")
          .attr("x", ctm.e + bbox.x + bbox.width/2)
          .attr("y", ctm.f + bbox.y + bbox.height/2+10)
          .text(Math.round((1000*data.piePct)/10) + "%");
      }
    }

    function addDonutLabel()
    {
      if(donutLabel=="") return;

      var x = elem.offsetWidth/2;
      var y = elem.offsetHeight/2;

      svg.append("text")
        .attr("class","donutlabelConfig")
        .attr("x",x-20)
        .attr("y",y)
        .text(donutLabel)

    }

    function basicTooltip()
    {
      tooltipObj = (d3.tooltip__()
        .chartContainer(container)
        .element('tooltip_' + container)
        .enabled(true).positionFX('absolute')
        .offset(true))();
    }

    function detailTooltip()
    {
      detailtooltipObj = (d3.DetailChartTooltip__()
        .chartContainer(container)
        //.data(getTooltipData())
        .enabled(true)
        .positionFX('absolute')
        .element('tooltip_' + container)
        .distance(30)
        .offset(false)
        .valueKey('Y')
        .colorKey('Color')
        .headerKey('X'))();
    }

    function getTooltipData()
    {
      var tooltipData = [];//{'Color':'red','X':"DT-Mix",'A':"Q1'2015",'Y':20},{'Color':'blue','X':"CDD-Mix",'A':"Q1'2015",'Y':25}

      var node={};
      if(xAxis!=series)
      {
        data.forEach(function(d){
          node={};
          node['A'] = d[xAxis]
          node['X'] = d[series]
          node['Y'] = d[yAxis[0]]
          node['Color'] = chart1.getColor(d[series])["fill"]

          tooltipData.push(node);
        })
      }

      if(y2Data!=undefined)
      {
        y2Data.forEach(function(d){
          node={};
          node['A'] = d[xAxis]
          node['X'] = d[series]
          node['Y'] = d[yAxis[0]]
          node['Color'] = chart1.getColor(d[series])["fill"]

          tooltipData.push(node);
        })
      }

      return tooltipData;
    }

    plotChart_.container = function(_) {
      if (!arguments.length) return container;
      container = _;
      return plotChart_;
    };

    plotChart_.data = function(_) {
      if (!arguments.length) return data;
      data = clone(_);
      return plotChart_;
    };

    plotChart_.xAxis = function(_) {
      if (!arguments.length) return xAxis;
      xAxis = _;
      return plotChart_;
    };

    plotChart_.yAxis = function(_) {
      if (!arguments.length) return yAxis;
      yAxis = _;
      return plotChart_;
    };

    plotChart_.zAxis = function(_) {
      if (!arguments.length) return zAxis;
      zAxis = _;
      return plotChart_;
    };

    plotChart_.series = function(_) {
      if (!arguments.length) return series;
      series = _;
      return plotChart_;
    };

    plotChart_.y2Data = function(_) {
      if (!arguments.length) return y2Data;
      y2Data = clone(_);
      return plotChart_;
    };

    plotChart_.hLines = function(_) {
      if (!arguments.length) return hLines;
      hLines = _;
      return plotChart_;
    };

    plotChart_.vLines = function(_) {
      if (!arguments.length) return vLines;
      vLines = _;
      return plotChart_;
    };

    plotChart_.chartType = function(_) {
      if (!arguments.length) return chartType;
      chartType = _;
      return plotChart_;
    };

    plotChart_.colorScheme = function(_) {
      if (!arguments.length) return colorScheme;
      colorScheme = _;
      return plotChart_;
    };

    plotChart_.bands = function(_) {
      if (!arguments.length) return bands;
      bands = _;
      return plotChart_;
    };

    plotChart_.bandColors = function(_) {
      if (!arguments.length) return bandColors;
      bandColors = _;
      return plotChart_;
    };

    plotChart_.dualAxis = function(_) {
      if (!arguments.length) return dualAxis;
      dualAxis = _;
      return plotChart_;
    };

    plotChart_.lineMarker = function(_) {
      if (!arguments.length) return lineMarker;
      lineMarker = _;
      return plotChart_;
    };

    plotChart_.innerRadius = function(_) {
      if (!arguments.length) return innerRadius;
      innerRadius = _;
      return plotChart_;
    };

    plotChart_.yAxisHidden = function(_) {
      if (!arguments.length) return yAxisHidden;
      yAxisHidden = _;
      return plotChart_;
    }

    plotChart_.showLabels = function(_) {
      if (!arguments.length) return showLabels;
      showLabels = _;
      return plotChart_;
    }

    plotChart_.donutLabel = function(_) {
      if (!arguments.length) return donutLabel;
      donutLabel = _;
      return plotChart_;
    }

    plotChart_.yMin = function(_) {
      if (!arguments.length) return yMin;
      yMin = _;
      return plotChart_;
    }

    plotChart_.yMax = function(_) {
      if (!arguments.length) return yMax;
      yMax = _;
      return plotChart_;
    }

    plotChart_.ticks = function(_) {
      if (!arguments.length) return ticks;
      ticks = _;
      return plotChart_;
    }

    plotChart_.legendWidth = function(_) {
      if (!arguments.length) return legendWidth;
      legendWidth = _;
      return plotChart_;
    }
    plotChart_.legendLeft = function(_) {
      if (!arguments.length) return legendLeft;
      legendLeft = _;
      return plotChart_;
    }

    plotChart_.showLegend = function(_) {
      if (!arguments.length) return showLegend;
      showLegend = _;
      return plotChart_;
    }
    plotChart_.legendFilter = function(_) {
      if (!arguments.length) return legendFilter;
      legendFilter = _;
      return plotChart_;
    }
    plotChart_.showTooltip = function(_) {
      if (!arguments.length) return showTooltip;
      showTooltip = _;
      return plotChart_;
    }
    plotChart_.showDetailTooltip = function(_) {
      if (!arguments.length) return showDetailTooltip;
      showDetailTooltip = _;
      return plotChart_;
    }
    plotChart_.showGridlines = function(_) {
      if (!arguments.length) return showGridlines;
      showGridlines = _;
      return plotChart_;
    }
    plotChart_.timeAxis = function(_) {
      if (!arguments.length) return timeAxis;
      timeAxis = _;
      return plotChart_;
    }

    plotChart_.timeFormat = function(_) {
      if (!arguments.length) return timeFormat;
      timeFormat = _;
      return plotChart_;
    }

    plotChart_.replaceTicks = function(_) {
      if (!arguments.length) return replaceTicks;
      replaceTicks = _;
      return plotChart_;
    }

    plotChart_.colorMapping = function(_) {
      if (!arguments.length) return colorMapping;
      colorMapping = _;
      return plotChart_;
    }

    plotChart_.xLabels = function(_) {
      if (!arguments.length) return xLabels;
      xLabels = _;
      return plotChart_;
    }

    plotChart_.shape = function(_) {
      if (!arguments.length) return shape;
      shape = _;
      return plotChart_;
    }

    plotChart_.barGap = function(_) {
      if (!arguments.length) return barGap;
      barGap = _;
      return plotChart_;
    }

    plotChart_.shapeLine = function(_) {
      if (!arguments.length) return shapeLine;
      shapeLine = _;
      return plotChart_;
    }

    plotChart_.orderList = function(_) {
      if (!arguments.length) return orderList;
      orderList = _;
      return plotChart_;
    }

    plotChart_.tooltipSeries = function(_) {
      if (!arguments.length) return tooltipSeries;
      tooltipSeries = _;
      return plotChart_;
    }

    plotChart_.tooltipFields = function(_) {
      if (!arguments.length) return tooltipFields;
      tooltipFields = _;
      return plotChart_;
    }

    plotChart_.aggrStackLabels = function(_) {
      if (!arguments.length) return aggrStackLabels;
      aggrStackLabels = _;
      return plotChart_;
    }

    plotChart_.eventHandler = function(_) {
      if (!arguments.length) return eventHandler;
      eventHandler = _;
      return plotChart_;
    }

    plotChart_.axisLabels = function(_) {
      if (!arguments.length) return axisLabels;
      axisLabels = _;
      return plotChart_;
    }

    plotChart_.renderChart = function() {
      chart1.data = data;
      assignColors();
      for(var i=1;i<s.length;i++)
        s[i].data = [];

      chart1.draw();

      for(var i=1;i<s.length;i++)
        s[i].data = y2Data;

      reDraw();
      
      if(showLegend)
      {
        legend1.InitlegendArray = null;
        legend1._draw();
        replaceLegendShapes();

        if(legendFilter)
        {
          filterValues = dimple.getUniqueValues(data, series==null?xAxis:series);
          legendInteraction(chart1,legend1);
          setLegendOpacity();
        }

      }

      setMargins();      

      chart1.setMargins(chartMargins.left, chartMargins.top, chartMargins.right, chartMargins.bottom);
      
      chart1.draw(800,true);

      defineTooltip();

      //return plotChart_;
    }
 
    plotChart_.resize = function(){
     

      svg.selectAll(".hLines").remove();
      //svg.selectAll(".vLines").remove();
      svg.selectAll(".labelConfig").remove();
      svg.selectAll(".donutlabelConfig").remove();

      chart1.draw(0,true);

      if(chartBands!=undefined)
        chartBands.draw(0,true);

      if(showLegend)
      {
        legend1._draw();
        replaceLegendShapes();

        if(legendFilter)
        {
          legendInteraction(chart1,legend1);
          setLegendOpacity();
        }

      }

      addHLines();
      //addVLines();
      addDonutLabel();


      tickCount = setYTicks();

      if(yAxis.length > 1 && !dualAxis)
      {
        y[0].ticks = tickCount;
      }
      else if(yAxis.length > 1 && dualAxis)
      {
        y[0].ticks = tickCount;
        y[1].ticks = tickCount;
      }
      else
      {
        y[0].ticks = tickCount;
      }

      setMargins();

      chart1.setMargins(chartMargins.left, chartMargins.top, chartMargins.right, chartMargins.bottom);

      if(chartBands!=undefined)
          chartBands.setMargins(chartMargins.left, chartMargins.top, chartMargins.right, chartMargins.bottom);

      chart1.draw();
      replaceCategories();
      if(x!=undefined)
        x.categLabels = categLabels;
               
    }

    function clone(obj)
    {
      if(obj === null || typeof(obj) !== 'object')
        return obj;

      var temp = obj.constructor(); // changed

      for(var key in obj) {
        if(Object.prototype.hasOwnProperty.call(obj, key)) {
          temp[key] = clone(obj[key]);
        }
      }
      return temp;
    }

    /*      plotChart_.subscribe = function(){
     widthWatcherID = watcher_.Subscribe(container,'width', function () {
     resize();
     });
     heightWatcherID = watcher_.Subscribe(container,'height', function () {
     resize();
     });
     return plotChart_;
     }
     plotChart_.width = function(value){
     if(!arguments.length) return chart;
     width = value;
     return plotChart_;
     }
     plotChart_.height = function(value){
     if(!arguments.length) return chart;
     height = value;
     return plotChart_;
     }
     */

    plotChart_.unSubscribe = function(){
      watcher_.unSubscribe(widthWatcherID);
      watcher_.unSubscribe(heightWatcherID);
      return plotChart_;
    }
    return plotChart_;
  };
})();
