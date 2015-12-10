'use strict';

angular.module('sasaWebApp')
  .controller('NavbarCtrl', function ($scope, $location, $rootScope, usersFactory) {
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

    $scope.sendToHomepage = function () {
      //find user homepage    
      $rootScope.myPromise= usersFactory.get({user:$rootScope.user}).$promise.then(function (data) { 
          if(data.homepage){
            var homepage = '/dashboard?dashboardId='+data.homepage.$oid;         
            $location.url(homepage)  
          }            
      }, function (){
          messageCenterService.add('danger', 'Could not load homepage', { timeout: 5000 });
      })
    }
  });