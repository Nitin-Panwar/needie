'use strict';

angular.module('sasaWebApp')
  .directive('metriccard', function (metricsFactory, $rootScope, dialogs, parentService, gridsterConfig) {
    return {
      templateUrl: 'app/metrics/metric-card/metric-card.html',
      restrict: 'EA',   
      replace: true,          
      scope: {metricData: '=',metricIndex: '='}, 
      link: function (scope, element, attrs) {
        //Varibales to change measure color
        // scope.measure_color_red=[]
        // scope.measure_color_green=[]

        //Setting options for the bar graph
        scope.options5 = {}; 
        if(scope.metricData['distributions'].length){
          if(scope.metricData['distributions'][0]['axis']){
              scope.options5.xAxis=scope.metricData['distributions'][0]['axis']
          }
          else{
             scope.options5.xAxis =  ["quarter","category"]
          }
          scope.options5.yAxis = [scope.metricData['distributions'][0]['distribution_data']['y_label']]
        }
        scope.options5.series = "category"
        scope.options5.chartType = ["bar"]
        scope.options5.showLegend = true;
        scope.options5.legendFilter = true
        scope.options5.showGridlines = false
                
        //function to change x axis 
        scope.changeXaxis=function(type){
          if(type=='WW'){
            scope.options5.xAxis = ["work_week","category"]
            scope.metricData['distributions'][0]['axis']=scope.options5.xAxis
          }
          if(type=='Month'){
          scope.options5.xAxis = ["month","category"]
          scope.metricData['distributions'][0]['axis']=scope.options5.xAxis
          }
          if(type=='Quarter'){
            scope.options5.xAxis = ["quarter","category"]
            scope.metricData['distributions'][0]['axis']=scope.options5.xAxis
          }
        }

        // this function launches the dialogs
        scope.launch = function(which,metricData,placeholder){
          switch(which){
            case 'data':              
              var dlg = dialogs.create('app/metrics/modals/data.html','ModalCtrl',metricData,'sm');
				      dlg.result.then(function (data) {
                // update selected columns in placeholder for saving
                $rootScope.placeholder.metric[scope.metricIndex].gridColumns = data;
                scope.metricData.gridColumns = data;
              })
              break;
            
            case 'filter':
              var dlg = dialogs.create('app/metrics/modals/filter.html','ModalCtrl',metricData,'sm');
              dlg.result.then(function (data) {                
                scope.metricData.filters = data;
                for(var key in scope.metricData.filters){
                  if(scope.metricData.filters[key].length === 0){delete scope.metricData.filters[key];}
                }
                scope.getMetric();
              });
              break;
          
            case 'measure':              
              var dlg = dialogs.create('app/metrics/modals/measures.html','ModalCtrl', metricData['measures'],'sm');              
              dlg.result.then(function(data){
                for(var i in data){
                  for(var key in data[i]){
                    metricData.measures[i][key] = data[i][key];
                  }
                }
              });              
                break;

            case 'metric':
              scope.metric=metricData;
              dialogs.create('app/metrics/modals/metricDetails.html','ModalCtrl',scope.metric,'sm');
              break;
           }
        };
    
        // This function watches the changes in global filter values
        scope.$watch(function () {
          return $rootScope.applyFilter;
        }, function(newValue, oldValue, scope) {         
          if(newValue !== oldValue){
            scope.getMetric();
          }          
        });


        //Define custom filer for object sorting
        scope.customFilter = function(items){
          var filtered = [];
          angular.forEach(items, function(value,key) {
            var obj ={'key':key,'value':value}
            filtered.push(obj);
          });
          filtered.sort(function (a, b) {
            return (a['key'] > b['key'] ? 1 : -1);
          });
          return filtered;
        }

        //function to change vizualization
        scope.changeViz = function (type) {
          if(type==='line' && !scope.line){
            scope.line=!scope.line;
          }
          if(type==='bar' && scope.line){
            scope.line=!scope.line;
          } 
        };

        //This function gets latest values of metrics
        scope.getMetric = function () {                
          scope.metricLoader = metricsFactory.getByObject({metric: scope.metricData, filters: $rootScope.globalQuery}).$promise.then(function (resposne) {            
            $rootScope.placeholder['metric'][scope.metricIndex]=resposne;
          },function (err) {
            console.error(err);
          })
        };

        //This function validates changes in measure thresholds
        scope.$watch('[options5,metricData["measures"]]',function(){
          scope.warningBreached = false;
          scope.alertBreached = false;    
          scope.measure_color_red=[]
          scope.measure_color_green=[]  
          for(var key in scope.metricData['measures']){ 
            var measure=scope.metricData.measures[key];
            if(measure.goal && measure.active){
              if(measure.goal.value===null){
                scope.alertBreached = false;
                scope.warningBreached = false;
              }
              else{
                if(measure.goal.scale===scope.options5.xAxis[0]){
                  if(scope.metricData['distributions'][0]['current_values']){
                    var current_value=scope.metricData['distributions'][0]['current_values'][scope.options5.xAxis[0]][measure.label]
                  }
                  if(measure.goal.comparision==='<'){
                    if(current_value < measure.goal.value){
                      scope.alertBreached = false;
                      scope.warningBreached = true;
                      // scope.measure_color_green[key]=true;
                      break;
                    }
                    else{
                      scope.alertBreached = true;
                      scope.warningBreached = false;
                      // scope.measure_color_red[key]=true;
                      break;
                    } 
                  }
                  if(measure.goal.comparision==='<='){
                    if(current_value <= measure.goal.value){
                      scope.alertBreached = false;
                      scope.warningBreached = true;
                      // scope.measure_color_green[key]=true;
                      break;
                    }
                    else{
                      scope.alertBreached = true;
                      scope.warningBreached = false;
                      // scope.measure_color_red[key]=true;
                      break;
                    }

                  }
                  if(measure.goal.comparision==='>'){
                    if(current_value > measure.goal.value){
                      scope.alertBreached = false;
                      scope.warningBreached = true;
                      // scope.measure_color_green[key]=true;
                      break;
                    }
                    else{
                      scope.alertBreached = true;
                      scope.warningBreached = false;
                      // scope.measure_color_red[key]=true;
                      break;
                    } 
                  }
                  if(measure.goal.comparision==='>='){
                    if(current_value >= measure.goal.value){
                      scope.alertBreached = false;
                      scope.warningBreached = true;
                      // scope.measure_color_green[key]=true;
                      break;
                    }
                    else{
                      scope.alertBreached = true;
                      scope.warningBreached = false;
                      // scope.measure_color_red[key]=true;
                      break;
                    } 
                  }
                }
              }
            }
            if(measure.active === undefined){
              measure.active = true;
            }
          } 
        },true);

        //isEmpty function 
        scope.isEmpty = function(argument){
          switch(typeof(argument)){
            case "array":
              if(argument.length === 0){return true;}
              break;
            case "object":
              if(Object.keys(argument).length === 0){return true;}
              break;
            case "string":
              if(argument.trim().length === 0){return true;}                            
              break;
            case "number":
              if(argument === 0){return true;}
              break;            
          }
          if(argument === undefined || argument === null){return true;}
          return false;
        };

        //This function removes a metric from dashboard
        scope.removeMetric = function (type, metric) {  
          parentService.placeholderRemove(type, metric);
          $rootScope.placeholder.edited = true;
        };
      
        // It watches for changes in metric card height to adjust for overflow
        scope.$watch(function () {
          return element[0].offsetHeight;
        }, function(newValue, oldValue, scope) {
          var notRight = false;
          // check if height is already set
          if(!scope.metricData.size.y){          
            notRight = true;
          }        
          else{
            var curHeight = gridsterConfig.rowHeight*scope.metricData.size.y;
            var diff = curHeight - newValue;
            // check if new height is higher than current height
            // or difference of new height and old height is more than a row size.
            if(newValue > curHeight || diff > gridsterConfig.rowHeight){
              notRight = true;
            }  
          }        
          // set expected height for gridster Item
          if(notRight){
            var height = Math.ceil((newValue+5)/gridsterConfig.rowHeight);  
            $rootScope.placeholder.metric[scope.metricIndex].size.y = height;
            scope.metricData.size.y = height;
          }
        }, false);
      }
    }
  });
