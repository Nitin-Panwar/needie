/**
 * Created by lnghiem on 6/9/2015.
 */
/************************************************************
 *  Developer: Nswamy
 *         Pluggable Tooltip module, reusable module which builds tooltip for a chart, provided data and position on mouse hover/out event.
 *
 ************************************************************/

(function(){
  'use strict';

  d3.DetailChartTooltip__ = function()
  {
    var content = null
      ,   data = null
      ,   distance = 10
      ,   chartContainer = null
      ,   tooltipElem = null
      ,   position = {left: null, top: null}
      ,   enabled = false
      ,   element = null
      ,   container = null
      ,   body = null
      ,   offset= true
      ,   color = null
      ,   fullContent = null
      ,   positionFX = null
      ,   fullView = null
      ,   headerKey
      ,   valueKey
      ,   colorKey;


    var create_Table = function(position,node_info,container){

      /*if tooltip diabled, then just return*/
      if(!enabled)
        return;

      var elem = container;
      var object = node_info.map(function(d){return d;});
      var tablearea = container.select('#'+element).node(),
        containerarea = d3.select('#'+chartContainer);
      var tooltip_height,tooltip_Width;
      var containerClass = container.attr('class');
      var offsets = document.getElementById(chartContainer).getBoundingClientRect();
      

      if(positionFX != 'fixed')
        offsets = {top:0,left:0};

      var top_ = position.top, //- w.scrollTop(),
        left_ = position.left+distance; //- w.scrollLeft()

      var tooltipContainer = body.select('.av-arrow-box').classed({'first': false, 'last': false,'left':false,'right':false});

          container.select('#'+element).selectAll('div').remove();

      var trs = container.select('#'+element).selectAll('.tt-item-group')
                  .data(d3.range(0,Math.ceil(object.length/10),1));

            trs.exit().remove();

     var div_tt_item = trs.enter()
                .append('div')
                .attr('class','tt-item-group');

      var spanEle = div_tt_item.selectAll('.tt-item').data(
                    function(d){
                      return object.splice(d,10);
                    }
                  );
                spanEle.exit().remove();
      var spanEleEle = spanEle.enter().append('div')
                      .attr('class',function(d){
                        return "tt-item " + (d.highlight == true?"active":d.header==true?"header":"");
                      });
          spanEleEle.append('span')
                    .attr('class','tt-item-rec')
                    .style('background',function(d){
                        return d[colorKey];
                      });
          spanEleEle.append('span')
                    .attr('class','tt-key')
                    .text(function(d){return d[headerKey];});;
          spanEleEle.append('b')
                    .text(function(d){return d[valueKey];});
          spanEleEle.append('div')
                    .attr('class','clearfix');

      /*After building table get height and width of it*/

      setTimeout(function(){

        tooltip_height = parseInt(document.getElementById(element+'parent').offsetHeight);
        tooltip_Width = parseInt(document.getElementById(element+'parent').offsetWidth);

        if(tooltip_height !==0 && tooltip_Width !== 0){

         if( (top_ - tooltip_height  ) > 0){
            top_ = top_-tooltip_height - (distance);
            tooltipContainer.classed({'last':true});
            top_ = top_<0?0:top_;
          }else{
            tooltipContainer.classed({'first':true})
            if((top_ + tooltip_height ) > parseInt(containerarea.style('height')) ){
                  top_ = parseInt(containerarea.style('height'))-tooltip_height;
             }
          }


          if((left_+tooltip_Width) >(parseInt(containerarea.style('width')) + offsets.left)){
            left_ = left_-tooltip_Width - (distance*3);
            tooltipContainer.classed({'right':true});
          }else{
            tooltipContainer.classed({'left':true});
          }

          container.style('top',top_+'px')
                  .style('left',left_+'px')
        }

      }, 100);

      /*adjust postion of tool tip*/

      container.style('display','inline-block')
        .style('background',color?color:'#ffffff')
        .style('opacity',0.9);


    };


    //Constructor to build the tooltip DOM element.
    function tooltip_() {

      if(!chartContainer) return;

      body = d3.select('#'+chartContainer);

      container = body.select("#"+element?element:'tooltip_')

      if (container.node() === null) {

        container = body.append("div")
          .attr('class','av-arrow-box left first ')
          .attr("id", element?element+"parent":'tooltip_')
          .style("z-index",1)
          .style('position',positionFX)
          .style('display','none');
          //.style('width','30%');


        container.append("div")
          .attr('class','av-arrow-box-inner')
          .attr("id", element?element:'tooltip_')

        container.selectAll('av-obtn-pane').data(fullView?[1]:[]).enter()
          .append("div")
          .attr('class','av-obtn-pane')
          .append('a')
          .text('View More')
          .on('click',function(){
            alertMethod();
          })
        ;

      }

      return tooltip_;
    };

    tooltip_.content = function(_) {
      if (!arguments.length) return content;
      content = _;
      return tooltip_;
    };
    tooltip_.color = function(_) {
      if (!arguments.length) return color;
      color = _;
      return tooltip_;
    };

    tooltip_.element = function(_) {
      if (!arguments.length) return content;
      element = _;
      return tooltip_;
    };

    tooltip_.fullView = function(_) {
      if (!arguments.length) return fullView;
      fullView = _;
      return tooltip_;
    };

    tooltip_.tooltipElem = function() {
      return tooltipElem;
    };

    tooltip_.contentGenerator = function(_) {
      if (!arguments.length) return contentGenerator;
      if (typeof _ === 'function') {
        contentGenerator = _;
      }
      return tooltip_;
    };

    tooltip_.positionFX = function(_){

      if (!arguments.length) return positionFX;

      positionFX = _;

      return tooltip_;
    }

    tooltip_.data = function(_) {
      if (!arguments.length) return data;
      data = _;
      return tooltip_;
    };

    tooltip_.distance = function(_) {
      if (!arguments.length) return distance;
      distance = _;
      return tooltip_;
    };
    tooltip_.offset = function(_) {
      if (!arguments.length) return offset;
      offset = _;
      return tooltip_;
    };

    tooltip_.chartContainer = function(_) {
      if (!arguments.length) return chartContainer;
      chartContainer = _;
      return tooltip_;
    };

    tooltip_.position = function(_) {
      if (!arguments.length) return position;
      position.left = (typeof _.left !== 'undefined') ? _.left : position.left;
      position.top = (typeof _.top !== 'undefined') ? _.top : position.top;
      return tooltip_;
    };

    tooltip_.enabled = function(_) {
      if (!arguments.length) return enabled;
      enabled = _;
      return tooltip_;
    };
    tooltip_.show = function() {
      create_Table(position,data,container);
      return tooltip_;
    };

     tooltip_.headerKey = function(_) {
      if (!arguments.length) return headerKey;
      headerKey = _;
      return tooltip_;
    };
    tooltip_.colorKey = function(_) {
        if (!arguments.length) return colorKey;
      colorKey = _;
      return tooltip_;
    };
    tooltip_.valueKey = function(_) {  
        if (!arguments.length) return valueKey;
      valueKey = _;
      return tooltip_;
    };
    tooltip_.hide = function(){
      if(container == null) return;
      container.style('display','none');
      return true;
    };
    tooltip_.id = function() {
      return id;
    };


    return tooltip_;
  };
})();