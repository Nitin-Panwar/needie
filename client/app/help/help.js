'use strict';

angular.module('sasaWebApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('help', {
        url: '/help',
        templateUrl: 'app/help/help.html',
        controller: 'HelpCtrl'
      });
  });