'use strict';

angular.module('sasaWebApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('help', {
        url: '/app/help',
        templateUrl: 'app/help/help.html',
        controller: 'HelpCtrl'
      });
  });