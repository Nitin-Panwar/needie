'use strict';

angular.module('sasaWebApp')
  .directive('scoreCard', function (metricsFactory, $rootScope, dialogs, parentService) {
    return {
      templateUrl: 'app/score-card/score-card.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {    
       }
    }
  });