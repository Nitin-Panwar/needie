'use strict';

angular.module('sasaWebApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('contactUs', {
        url: '/contactUs',
        templateUrl: 'app/contactUs/contactUs.html',
        controller: 'ContactUsCtrl'
      });
  });