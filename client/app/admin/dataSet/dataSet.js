'use strict';

angular.module('sasaWebApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('dataSet', {
        url: '/dataSet',
        templateUrl: 'app/admin/dataSet/dataSet.html',
        controller: 'DataSetCtrl'
      });
  });