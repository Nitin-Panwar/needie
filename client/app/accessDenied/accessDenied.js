'use strict';

angular.module('sasaWebApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('accessDenied', {
        url: '/accessDenied',
        templateUrl: 'app/accessDenied/accessDenied.html',
        controller: 'AccessDeniedCtrl',
        data: {
        	requireLogin: false
      	}
      });
  });