'use strict';

angular.module('sasaWebApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    },
    {
      'title': 'Explore',
      'link': '/explore'
    },
    {
      'title': 'Admin',
      'link': '/admin'
    }];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });