'use strict';

angular.module('sasaWebApp')
  .directive('dashboardSeparator', function () {
    return {
      templateUrl: 'components/directives/dashboard-separator/dashboard-separator.html',
      restrict: 'EA',
      replace: true,
      link: function (scope, element, attrs) {
      }
    };
  });