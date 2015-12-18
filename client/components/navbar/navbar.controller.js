'use strict';

angular.module('sasaWebApp')
  .controller('NavbarCtrl', function ($scope, $location, $rootScope, usersFactory,dashBoardsFactory) {
    $scope.menu = [       
    {
      'title': 'Create Dashboard',
      'link': '/dashboard'
    }
    // {
    //   'title': 'Admin',
    //   'link': '/a'
    // }
    ];

    $scope.redirect = function (dashboard) {
      var url = '/dashboard?dashboardId='+dashboard._id['$oid'];         
      $location.url(url)
    }


    $scope.searchableItems = function () {
      $scope.searchLoader=dashBoardsFactory.index().$promise.then(function(data){
        $scope.searchedDashboard = data;
      }, function (){
          messageCenterService.add('danger', 'Dashboard search failed', { timeout: 5000 });
      }); 
    };      

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });