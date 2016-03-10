'use strict';

angular.module('sasaWebApp')
  .directive('metriccard', function (metricsFactory, $rootScope, dialogs, parentService, gridsterConfig) {
    return {
      templateUrl: 'app/metrics/metric-card/metric-card.html',
      restrict: 'EA',   
      replace: true,          
      scope: {metricData: '=',metricIndex: '='}, 
      // pre-link: ,     
      link: function (scope, element, attrs) {
        scope.XAxis=['X-Axis','WW','Month','Quarter']
         //Multi Series Line Chart With Verticle Lines
          // scope.options1 = {};
          // scope.options1.xAxis = 'DELTAWW'
          // scope.options1.yAxis = ["MEASURE"]
          // scope.options1.series = "CATEGORY"
          // scope.options1.chartType = ["line"]
          // scope.options1.lineMarker = true
          scope.options1 = {};
          scope.options1.xAxis = 'month' 
          scope.options1.yAxis = [scope.metricData['distributions'][0]['distribution_data']['y_label']]
          scope.options1.series = "category"
          scope.options1.chartType = ["line"]
          scope.options1.lineMarker = true
          // scope.options1.vLines = [{"vLineName":"high","vLineValue":1,"DT":"1/1/1806"},
          //               {"vLineName":"low","vLineValue":1,"DT":"1/1/1802"},
                              // ]
          // scope.options1.colorScheme = ["cyan","green","brown","red"]
          // scope.options1.colorMapping = {"high":"red","low":"blue"}
          // //scope.options1.showLabels = true
          scope.options1.showGridlines = false
          // // scope.options1.ticks = 7
          // //scope.options1.yMin = 0
          // //scope.options1.yMax = 20
          // scope.options1.timeAxis = true
          // scope.options1.timeFormat = "%Y"
          // scope.options1.xLabels = [-5,-4,-3,-2,-1,0,1,2,3,4,5]
          // scope.data=scope.metricData['distributions'][0]['distribution_data']['data']
          scope.options5 = {}; 
          scope.options5.xAxis =  ["quarter","category"]
          scope.options5.yAxis = [scope.metricData['distributions'][0]['distribution_data']['y_label']]
          scope.options5.series = "category"
          scope.options5.chartType = ["bar"]
          scope.options5.showLegend = true;
          scope.options5.legendFilter = true
          scope.options5.showGridlines = false
          // scope.options5.colorScheme = ["green","brown","red"]
          // if(scope.metricData['measures'][0]['goal']!==undefined){
          //   scope.options5.hLines = [
          //   { "y" : scope.metricData['measures'][0]['goal'], "color" : 'red'}]
          // }

          // scope.$watch(scope.metricData['measures'][0]['goal'],function(newValue,oldValue){
          //   console.log(newValue,oldValue)
          // })
        
                 
          scope.changeXaxis=function(type){
            if(type=='WW'){
              scope.options5.xAxis = ["work_week","category"]
              scope.options1.xAxis = 'work_week' 
            }
            if(type=='Month'){
            scope.options5.xAxis = ["month","category"]
            scope.options1.xAxis = 'month' 
            }
            if(type=='Quarter'){
              scope.options5.xAxis = ["quarter","category"]
              scope.options1.xAxis = 'quarter'
            }
          }
          /**
           * this function launches the dialogs
           * @param  {[type]} which       [description]
           * @param  {[type]} metricData  [description]
           * @param  {[type]} placeholder [description]
           * @return {[type]}             [description]
           */
          scope.launch = function(which,metricData,placeholder){
            switch(which){
              /**
               * data dialog
               */
              case 'data':              
                var dlg = dialogs.create('app/metrics/modals/data.html','ModalCtrl',metricData,'sm');
  				      dlg.result.then(function (data) {
                  // update selected columns in placeholder for saving
                  $rootScope.placeholder.metric[scope.metricIndex].gridColumns = data;
                  scope.metricData.gridColumns = data;
                })
                break;
              /**
               * filter dialog
               */
              case 'filter':
                var dlg = dialogs.create('app/metrics/modals/filter.html','ModalCtrl',metricData,'sm');
                dlg.result.then(function (data) {
                  console.log("2")
                  console.log(data)
                  // $rootScope.placeholder.metric[scope.metricIndex].filters = data;                
                  scope.metricData.filters = data;
                  for(var key in scope.metricData.filters){
                    if(scope.metricData.filters[key].length === 0){delete scope.metricData.filters[key];}
                  }
                  scope.getMetric();
                });
                break;
              /**
               * measure diaglog
               */
              case 'measure':              
                var dlg = dialogs.create('app/metrics/modals/measures.html','ModalCtrl', metricData['measures'],'sm');              
                dlg.result.then(function(data){
                  // console.log(data)
                  // $rootScope.placeholder['metric'][scope.metricIndex]['measures'] =data;
                  for(var i in data){
                    for(var key in data[i]){
                      metricData.measures[i][key] = data[i][key];
                    }
                  }
                  // scope.getMetric();
                });              
                  break;
              /**
               * metric details dialog
               */
              case 'metric':
                scope.metric=metricData;
                dialogs.create('app/metrics/modals/metricDetails.html','ModalCtrl',scope.metric,'sm');
                break;
             }
          };

          // 
          // this code here watches the changes in global filter values
          // 
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

        
          /**
           * [function to change vizualization]
           * @param  {[type]} type [description]
           * @return {[type]}      [description]
           */
          scope.changeViz = function (type) {
            if(type==='line' && !scope.line){
              scope.line=!scope.line;
            }
            if(type==='bar' && scope.line){
              scope.line=!scope.line;
            } 
          };


          /**
           * this function gets latest values of metrics
           * @return {[type]} [description]
           */
          scope.getMetric = function () {                
            scope.metricLoader = metricsFactory.getByObject({metric: scope.metricData, filters: $rootScope.globalQuery}).$promise.then(function (resposne) {            
              $rootScope.placeholder['metric'][scope.metricIndex]=resposne;
              console.log(resposne);
            },function (err) {
              console.error(err);
            })
          };

        /**
         * this function watches for chnages in metric details
         * @param  {[type]} )                  {                             if(scope.metricData ! [description]
         * @param  {[type]} function(newValue, oldValue,     scope) {                                                     scope.breachedStatus(newValue);         } [description]
         * @param  {[type]} true               [description]
         * @return {[type]}                    [description]
         */
        scope.$watch(function () {
          if(scope.metricData !== undefined){
            return scope.metricData;  
          }  
          // return null;        
        }, function(newValue, oldValue, scope) {          
          scope.breachedStatus(newValue); 
        }, true);

        /**
         * this function validates changes in measure thresholds
         * @return {[type]} [description]
         */
        scope.breachedStatus = function (data) {
          scope.warningBreached = false;
          scope.alertBreached = false;         
          for(var key in data['measures']){            
            var measure = data.measures[key];      
            if(measure.active === undefined){measure.active = true;}      
            if(measure.threshold !== undefined && measure.active === true){
              // if a user setup a threshold and later deleted it,
              // it results in null
              // which is always greater than actual measure value
              // below we check for those nulls and delete them
              for(var i in measure.threshold){
                if(measure.threshold[i] === null){
                  delete measure.threshold[i];
                }
              }
              if(measure.threshold.upperAlert <= measure.value || measure.threshold.lowerAlert >= measure.value || measure.goal<=measure.value){
                scope.alertBreached = true;
                scope.warningBreached = false;
                break;
              }
              if(measure.threshold.upperWarning <=measure.value || measure.threshold.lowerWarning >= measure.value){
                scope.warningBreached = true;
                scope.alertBreached = false;
              }  
            }            
          }
        };

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

      /**
       * this function removes a metric from dashboard
       * @param  {[type]} type   [description]
       * @param  {[type]} metric [description]
       * @return {[type]}        [description]
       */
      scope.removeMetric = function (type, metric) {    
        parentService.placeholderRemove(type, metric);
        $rootScope.placeholder.edited = true;
      };
      
      /**
       * It watches for changes in metric hard height to adjust for overflow
       *
       */
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
          var height = Math.ceil(newValue/gridsterConfig.rowHeight);  
          $rootScope.placeholder.metric[scope.metricIndex].size.y = height;
          scope.metricData.size.y = height;
        }
      }, false);
      

      }
    }
  });
