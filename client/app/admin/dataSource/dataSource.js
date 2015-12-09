'use strict';

angular.module('sasaWebApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('dataSource', {
        url: '/dataSource',
        templateUrl: 'app/admin/dataSource/dataSource.html',
        controller: 'DataSourceCtrl'
      });
  });