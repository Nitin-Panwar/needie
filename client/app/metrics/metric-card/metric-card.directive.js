'use strict';

angular.module('sasaWebApp')
  .directive('metriccard', function (metricsFactory, $rootScope, dialogs, parentService) {
    return {
      templateUrl: 'app/metrics/metric-card/metric-card.html',
      restrict: 'EA',   
      replace: true,          
      scope: {metricData: '='}, 
      // pre-link: ,     
      link: function (scope, element, attrs) {

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
              dialogs.create('/app/metrics/modals/data.html','ModalCtrl',{},'sm');
              break;
            /**
             * filter dialog
             */
            case 'filter':
              dialogs.create('/app/metrics/modals/filter.html','ModalCtrl',{},'sm');
              break;
            /**
             * filter diaglog
             */
            case 'measure':              
              var dlg = dialogs.create('/app/metrics/modals/measures.html','ModalCtrl', metricData['measures'],'sm');              
              dlg.result.then(function(data){
                for(var i in data){
                  for(var key in data[i]){
                    metricData.measures[i][key] = data[i][key];
                  }
                }
              });              
              break;
            /**
             * metric details dialog
             */
            case 'metric':
              delete metricData['distributions'];
              scope.metric=metricData;
              dialogs.create('/app/metrics/modals/metricDetails.html','ModalCtrl',scope.metric,'sm');
              break;
           }
        };

        // 
        // this code here watches the changes in global filter values
        // 
        scope.$watch(function () {
          return $rootScope.applyFilter;
        }, function(newValue, oldValue, scope) {          
          if($rootScope.applyFilter !== 0){
            scope.getMetric();  
          }
          
        });

        /**
         * this function gets latest values of metrics
         * @return {[type]} [description]
         */
        scope.getMetric = function () {
          var id = scope.metricData._id;
          scope.metricData = null;
          scope.metricLoader = metricsFactory.filterShow({metricID: id, filters: $rootScope.globalQuery}).$promise.then(function (resposne) {            
            scope.metricData = resposne;
          },function (err) {
            console.error(err);
          })
        }

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
            if(measure.threshold !== undefined){
              // if a user setup a threshold and later deleted it,
              // it results in null
              // which is always greater than actual measure value
              // below we check for those nulls and delete them
              for(var i in measure.threshold){
                if(measure.threshold[i] === null){
                  delete measure.threshold[i];
                }
              }
              if(measure.threshold.upperAlert <= measure.value || measure.threshold.lowerAlert >= measure.value){
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
        }

      /**
       * this function removes a metric from dashboard
       * @param  {[type]} type   [description]
       * @param  {[type]} metric [description]
       * @return {[type]}        [description]
       */
      scope.removeMetric = function (type, metric) {        
        parentService.placeholderRemove(type, metric);
        $rootScope.placeholder.edited = true;
      }
      }
    }
  });
