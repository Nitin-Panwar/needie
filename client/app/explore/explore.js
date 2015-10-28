'use strict';

angular.module('sasaWebApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('explore', {
        url: '/explore',
        templateUrl: 'app/explore/explore.html',
        controller: 'ExploreCtrl'
      });
  });