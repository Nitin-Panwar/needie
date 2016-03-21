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
        //For changing measure's color
        scope.measure_color_green=[]
        scope.measure_color_red=[]
    
          scope.options5 = {}; 
          if(scope.metricData['distributions'][0]['axis']){
              scope.options5.xAxis=scope.metricData['distributions'][0]['axis']
          }
          else{
             scope.options5.xAxis =  ["quarter","category"]
          }
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
              // scope.options1.xAxis = 'work_week' 
              scope.metricData['distributions'][0]['axis']=scope.options5.xAxis
            }
            if(type=='Month'){
            scope.options5.xAxis = ["month","category"]
            // scope.options1.xAxis = 'month' 
            scope.metricData['distributions'][0]['axis']=scope.options5.xAxis
            }
            if(type=='Quarter'){
              scope.options5.xAxis = ["quarter","category"]
              // scope.options1.xAxis = 'quarter'
              scope.metricData['distributions'][0]['axis']=scope.options5.xAxis
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
        // scope.$watch(function () {
        //   if(scope.metricData !== undefined){
        //     return scope.metricData;  
        //   }  
        //   // return null;        
        // }, function(newValue, oldValue, scope) {          
        //   scope.breachedStatus(newValue); 
        // }, true);

        /**
         * this function validates changes in measure thresholds
         * @return {[type]} [description]
         */
        scope.$watch('[options5,metricData["measures"]]',function(){
          scope.warningBreached = false;
          scope.alertBreached = false;      
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
                  if(measure.goal.comparision==='<' || measure.goal.comparision==='<='){
                    if(measure.goal.value <=current_value){
                      scope.alertBreached = true;
                      scope.warningBreached = false;
                      break;
                    }
                    else{
                      scope.alertBreached = false;
                      scope.warningBreached = true;
                      break;
                    } 
                  }
                  if(measure.goal.comparision==='>' || measure.goal.comparision==='>='){
                    if(measure.goal.value >=current_value){
                      scope.alertBreached = true;
                      scope.warningBreached = false;
                      break;
                    }
                    else{
                      scope.alertBreached = false;
                      scope.warningBreached = true;
                      break;
                    } 
                  }
                }
              }
            }
            if(measure.active === undefined){measure.active = true;}
          } 
        },true);

        

        // scope.breachedStatus = function (data) {
        //   scope.warningBreached = false;
        //   scope.alertBreached = false; 
        //   console.log(measure)     
        //   for(var key in data['measures']){  
        //     var measure=data.measures[key];
        //     if(measure.goal){
        //       if(measure.goal.scale===scope.options5.xAxis[0]){
        //         if(data['distributions'][0]['current_values']){
        //           var current_value=data['distributions'][0]['current_values'][scope.options5.xAxis[0]][measure.name]
        //         }
        //         if(measure.goal.comparision==='<' || measure.goal.comparision==='<='){
        //           if(measure.goal.value <=current_value){
        //             // scope.measure_color_red[key]=true;
        //             scope.alertBreached = true;
        //             scope.warningBreached = false;
        //             break;
        //           }
        //           else{
        //             // scope.measure_color_green[key]=true;
        //             scope.alertBreached = false;
        //             scope.warningBreached = true;
        //             break;
        //           } 
        //         }
        //         if(measure.goal.comparision==='>' || measure.goal.comparision==='>='){
        //           if(measure.goal.value >current_value){
        //             // scope.measure_color_red[key]=true;
        //             scope.alertBreached = true;
        //             scope.warningBreached = false;
        //             break;
        //           }
        //           else{
        //             // scope.measure_color_green[key]=true;
        //             scope.alertBreached = false;
        //             scope.warningBreached = true;
        //             break;
        //           } 
        //         }
        //       }
        //     }
        //     if(measure.active === undefined){measure.active = true;}
        //     // var goal = data.measures[key].goal.value;
        //     // if(measure.threshold !== undefined && measure.active === true){
        //       // if a user setup a threshold and later deleted it,
        //       // it results in null
        //       // which is always greater than actual measure value
        //       // below we check for those nulls and delete them
        //       // for(var i in measure.threshold){
        //       //   if(measure.threshold[i] === null){
        //       //     delete measure.threshold[i];
        //       //   }
        //       // }
        //       // if(measure.threshold.upperAlert <= measure.value || measure.threshold.lowerAlert >= measure.value || measure.goal<=measure.value){
        //       //   scope.alertBreached = true;
        //       //   scope.warningBreached = false;
        //       //   break;
        //       // }
        //       // if(measure.threshold.upperWarning <=measure.value || measure.threshold.lowerWarning >= measure.value){
        //       //   scope.warningBreached = true;
        //       //   scope.alertBreached = false;
        //       } 
        //     }       
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
