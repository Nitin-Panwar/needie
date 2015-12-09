'use strict';

angular.module('sasaWebApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [       
    {
      'title': 'Create Dashboard',
      'link': '/dashboard'
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