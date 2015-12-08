'use strict';

angular.module('sasaWebApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('dashboard', {
        url: '/dashboard?:dashboardId',
        templateUrl: 'app/dashboard/dashboard.html',
        controller: 'DashboardCtrl',
        data: {
        	requireLogin: true
      	}
      });
  });