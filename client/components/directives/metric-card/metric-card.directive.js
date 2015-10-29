'use strict';

angular.module('sasaWebApp')
  .directive('metricCard', function () {
    return {
      templateUrl: 'components/directives/metric-card/metric-card.html',
      restrict: 'EA',             
      scope: {metricId: '@'},      
      link: function (scope, element, attrs) {
      	console.info(scope.metricId);
      }
    };
  });