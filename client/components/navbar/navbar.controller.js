'use strict';

angular.module('sasaWebApp')
  .controller('NavbarCtrl', function ($scope, $location, $rootScope, usersFactory,dashBoardsFactory) {
    $scope.menu = [       
    {
      'title': 'Create Dashboard',
      'link': '/'
    }];

    $rootScope.closeLeftSidebar= false;

    /**
     * [redirect description]
     * @param  {[type]} dashboard [description]
     * @return {[type]}           [description]
     */
    $scope.redirect = function (dashboard) {
      var url = '/?dashboardId='+dashboard._id['$oid'];         
      $location.url(url)
    }


    /**
     * [clearPlaceholder description]
     * @return {[type]} [description]
     */
    $scope.createNew = function(){
      $rootScope.createNew = true;
      $rootScope.placeholder={metric: [], textBoxes: [], dashboard: {}, edited: false}; 
      $rootScope.GlobalFilters = {};
      $rootScope.globalQuery = {};
    }

    //Function to close leftsidebar 
    $scope.closelsb =  function(){
        console.log("close LSB running")
         $rootScope.closeLeftSidebar= true;
    }; 
    

    /**
     * [searchableItems description]
     * @return {[type]} [description]
     */
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