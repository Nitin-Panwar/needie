'use strict';

angular.module('sasaWebApp')
  .directive('metriccard', function (metricsFactory,messageCenterService, $rootScope, dialogs, parentService, gridsterConfig, $mdDialog, $mdMedia) {
    return {
      templateUrl: 'app/metrics/metric-card/metric-card.html',
      restrict: 'EA',   
      replace: true,          
      scope: {metricData: '=',metricIndex: '='}, 
      link: function (scope, element, attrs) {
        //Setting options for the bar graph
        scope.options5 = {}; 
        scope.advanceVisualization = false
        if(scope.metricData['distributions'] && scope.metricData['distributions'].length  && scope.metricData['distributions'][0]!==null){
          if(scope.metricData['distributions'][0]['advance_viz']){
            scope.advanceVisualization=(scope.metricData['distributions'][0]['x_data'].length>1)?false:true
            
            if(scope.metricData['distributions'][0]['group_by'][0]){
              scope.options5.series = scope.metricData['distributions'][0]['group_by'][0]
              scope.options5.xAxis =  [scope.metricData['distributions'][0]['distribution_data']['x_label'],scope.metricData['distributions'][0]['group_by'][0]]
            }
            else{
              scope.options5.series = (scope.metricData['distributions'][0]['y_data'].length>1)?"category":""
              scope.options5.xAxis =  [scope.metricData['distributions'][0]['distribution_data']['x_label']]
              if(scope.options5.series !== "")
                scope.options5.xAxis.push(scope.options5.series)
              else
                scope.options5.orderList = [] 
            }

            if(scope.metricData['distributions'][0]['sortByyaxis'] && scope.metricData['distributions'][0]['sortByyaxis'][0]['yaxis'])
              scope.options5.orderList = ["orderlist",scope.metricData['distributions'][0]['sortByyaxis'][0]['descOrder']]
    
          }
          else{
            scope.options5.xAxis=(scope.metricData['distributions'][0]['axis'])?scope.metricData['distributions'][0]['axis']:["quarter","category"]
            scope.options5.series = "category"
          }
          scope.options5.yAxis = [scope.metricData['distributions'][0]['distribution_data']['y_label']]
          
        }

        scope.options5.chartType = ["bar"]
        scope.options5.showLegend = true;
        scope.options5.legendFilter = true
        scope.options5.showGridlines = false


        //function to change x axis 
        
        scope.changeXaxis=function(type){
          scope.options5.changeXaxis=true
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

        
        /**
         * This function create copy of metric
         * @param  {[type]} metricdata   [Data of Metric to create copy]
        */
        scope.createDuplicate = function(metricData){
          parentService.placeholderAdd('duplicatemetric',metricData);
        }

        // this function launches the dialogs
        scope.launch = function(ev,which,metricData){
          var tab = which
          $mdDialog.show({
            controller: 'ModalCtrl',
            templateUrl: 'app/metrics/modal/dialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:false,
            escapeToClose: false,
            locals: {
                data: metricData,
                tab: tab
              }
          }).then(function(data) {  
              var selectedTab = data['tab']
              delete data['tab'];
              switch(selectedTab){
                case 'data':
                  $rootScope.placeholder.metric[scope.metricIndex].gridColumns = data;
                  scope.metricData.gridColumns = data;  
                  break;
                case 'filter':
                  scope.metricData.filters = data;
                  for(var key in scope.metricData.filters){
                    if(scope.metricData.filters[key].length === 0)
                      {delete scope.metricData.filters[key];}
                  }
                  scope.getMetric();
                  break;
                case 'measure':
                  for(var i in data){
                    for(var key in data[i]){
                      metricData.measures[i][key] = data[i][key];
                    }
                  }
                  break;
                case 'visualization':
                  if(scope.metricData['distributions'] && scope.metricData['distributions'].length>0) {
                    for(var key in data){
                        scope.metricData['distributions'][0][key] = data[key];
                      
                    }
                  }
                  scope.getMetric();
                  break;
                default:
                  return
              }
                    
          });  
        }
    
        //This function watches the changes in global filter values
        scope.$watch(function () {
          return $rootScope.applyFilter;
        }, function(newValue, oldValue, scope) {       
          if(newValue !== oldValue){
            scope.getMetric();
          }          
        });

        //Watch var_changeData to change score_card data
        scope.$watch(function () {
          return $rootScope.var_changeData;
        }, function(newValue, oldValue, scope) {       
          if(newValue !== oldValue){
            scope.getMetric();
          }          
        });

        //Watch viewType to change data 
        scope.$watch(function () {
          return $rootScope.meta.view_type;
        }, function(newValue, oldValue, scope) {   
          if(scope.metricData['distributions']){
            if(newValue !== oldValue  && newValue === 'scorecard' && scope.metricData['distributions'].length>0){
              var callAPI = false;
              for (var i = 0; i < scope.metricData.measures.length; i++) {
                if(scope.metricData.measures[i]['scorecard_data']){
                  if(scope.metricData.measures[i]['scorecard_data'].length ===0){
                    callAPI = true;
                    break;
                  }
                }
              };
              if(callAPI == true){
                scope.getMetric();
              }
            }
          }          
        });

        //This function gets latest values of metrics
        $rootScope.promiseObject = {};
        scope.getMetric = function () { 

          if($rootScope.meta.view_type=='scorecard'){
            scope.requestPromise = metricsFactory.getByObject({metric: scope.metricData, filters: $rootScope.globalQuery,meta:$rootScope.meta}).$promise.then(function (response) {
              $rootScope.placeholder['metric'][scope.metricIndex]=response;
              delete $rootScope.promiseObject[scope.metricIndex];                                 
            });
            $rootScope.promiseObject[scope.metricIndex] = scope.requestPromise;
            var arr = [];
            for(var key in $rootScope.promiseObject){
              arr.push($rootScope.promiseObject[key])
            }          
            $rootScope.myPromise = arr; 
          }
          else{
            scope.metricLoader = metricsFactory.getByObject({metric: scope.metricData, filters: $rootScope.globalQuery,meta:$rootScope.meta}).$promise.then(function (response) {
             $rootScope.placeholder['metric'][scope.metricIndex]=response;
              if(response['distributions'] && response['distributions'][0] && response['distributions'][0]['distribution_data']['data'].length>0 && response['distributions'][0]['advance_viz']==true){
                
                scope.advanceVisualization=(response['distributions'][0]['x_data'].length>1)?false:true
                
                if(response['distributions'][0]['group_by'][0]){
                  scope.options5.series = response['distributions'][0]['group_by'][0]
                  scope.options5.xAxis =  [response['distributions'][0]['distribution_data']['x_label'],response['distributions'][0]['group_by'][0]]
                }
                else{
                  scope.options5.series = (response['distributions'][0]['y_data'].length>1)?"category":""
                  scope.options5.xAxis =  [response['distributions'][0]['distribution_data']['x_label']]
                  if(scope.options5.series !== "")
                    scope.options5.xAxis.push(scope.options5.series)
                  else
                    scope.options5.orderList = [] 
                }
                
                scope.options5.yAxis = [response['distributions'][0]['distribution_data']['y_label']]
                if(response['distributions'][0]['sortByyaxis'][0]['yaxis']==true)
                  scope.options5.orderList = ["orderlist",response['distributions'][0]['sortByyaxis'][0]['descOrder']]
              }
          }, function (err) {
            messageCenterService.add('danger','No Data Found',{timeout: 10000});
          });            
        }                     
        }  

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
                      break;
                    }
                    else{
                      scope.alertBreached = true;
                      scope.warningBreached = false;
                      break;
                    } 
                  }
                  if(measure.goal.comparision==='<='){
                    if(current_value <= measure.goal.value){
                      scope.alertBreached = false;
                      scope.warningBreached = true;
                      break;
                    }
                    else{
                      scope.alertBreached = true;
                      scope.warningBreached = false;
                      break;
                    }

                  }
                  if(measure.goal.comparision==='>'){
                    if(current_value > measure.goal.value){
                      scope.alertBreached = false;
                      scope.warningBreached = true;
                      break;
                    }
                    else{
                      scope.alertBreached = true;
                      scope.warningBreached = false;
                      break;
                    } 
                  }
                  if(measure.goal.comparision==='>='){
                    if(current_value >= measure.goal.value){
                      scope.alertBreached = false;
                      scope.warningBreached = true;
                      break;
                    }
                    else{
                      scope.alertBreached = true;
                      scope.warningBreached = false;
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
      
        //It watches for changes in metric card height to adjust for overflow
        scope.$watch(function () {
          return element[0].offsetHeight;
        }, function(newValue, oldValue, scope) {
          if(newValue!==oldValue){
            var notRight = false;
            // check if height is already set
            if(!scope.metricData.size.y){          
              notRight = true;
            }        
            else{
              var curHeight = gridsterConfig.rowHeight*scope.metricData.size.y;
              var diff = curHeight - newValue;
              // check if new height is higher than current height
              // or difference of new height and old height is more than a rowro size.
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
          }
        }, false);
      }
    }
  });