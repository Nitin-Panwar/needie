'use strict';

angular.module('sasaWebApp')
  .controller('NavbarCtrl', function ($scope, $location, $rootScope,$timeout,usersFactory,dashBoardsFactory,messageCenterService,$mdDialog) {
    $scope.menu = [       
    {
      'title': 'Create Dashboard',
      'link': '/'
    }];

    $rootScope.closeLeftSidebar= false;
    $scope.isAdvSeachSectionShow=false;
    $scope.isOpenDashBoard=false;
    $scope.opened = false;
    $scope.dashboardName=undefined;
    $scope.noResponses=false;
    $scope.IDSIDName="";
    $scope.dashboardName="";
    /**
     * [redirect description]
     * @param  {[type]} dashboard [description]
     * @return {[type]}           [description]
     */
    $scope.redirect = function (dashboard) {
      var url = '/?dashboardId='+dashboard._id['$oid'];         
      $location.url(url)
      //window.location.reload()
    }


    $scope.sendToHomepage = function(){
      $scope.isAdvSeachSectionShow=false;
      window.location.reload()
    }
    $scope.help=function(){
     $scope.isAdvSeachSectionShow=false;
       $mdDialog.cancel();
    };
    $scope.contactUs=function(){
     $scope.isAdvSeachSectionShow=false;
    };
    /**
     * [clearPlaceholder description]
     * @return {[type]} [description]
     */
    $scope.createNew = function(){
      $scope.isAdvSeachSectionShow=false;
      $rootScope.createNew = true;
      $rootScope.placeholder={metric: [], textBoxes: [], dashboard: {}, edited: false}; 
      $rootScope.meta = {'details': [{'timeframe': 'historical','dimension': 'work_week','window_size': 10,"sequence":1},{'timeframe': 'historical','dimension': 'month','window_size': 0,"sequence":2},{'timeframe': 'historical','dimension': 'quarter','window_size': 2,"sequence":3},{'timeframe': 'historical','dimension': 'year','window_size': 0,"sequence":4}],'view_type': 'metriccard'}
      $rootScope.GlobalFilters = {};
      $rootScope.globalQuery = {};
      $rootScope.applyFilter =0;
    }

    //Function to close leftsidebar 
    $scope.closelsb =  function(){
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
    $scope.$watch('IDSIDName', function() {
        if($scope.IDSIDName.length === 0){
          $scope.isOpenDashBoard=false;
        }
    });
     /*
       User story Name:Provide advanced dashboard search capability -US15206
       Method name getAllIdsidValues is used to get all the idsid values 
       Request Parameter:NA
       Response:Array of idsid values which will populates for idsid  typeahead input component
     */
    $scope.getAllIdsidValues=function(){
      $scope.IDSIDName="";
      $scope.dashboardName="";
      $scope.isOpenDashBoard=false;
      if($scope.isAdvSeachSectionShow === false){
               $scope.IdsidLoader=usersFactory.getIdsid().$promise.then(function(data){
                    $scope.idsidValues = data;
                  }, function (){
                      messageCenterService.add('danger', 'Idsid search failed', { timeout: 5000 });
                  }); 
         }
        if($scope.isAdvSeachSectionShow === true)
           $scope.isAdvSeachSectionShow=false;
         else{
           $scope.isAdvSeachSectionShow=true;
         }
      
    };

     /*
       User story Name:Provide advanced dashboard search capability-US15206
       Method name getDashboardNameByIDSID is used to get all dasboard name for the selected idsid value.
       Request Parameter : idsid
       Response:Array of dashboard values which will populates for dashboard typeahead input component
     */
    $scope.getDashboardNameByIDSID=function(idsid){
      $scope.dashboardName="";
      var idsid=idsid.idsid;
      $scope.dashboardNameLoader=dashBoardsFactory.getDashboardNamebyIdsid({idsid: idsid}).$promise.then(function(data){
                    $scope.dashboardNames = data;
                    if($scope.dashboardNames.length === 0){
                      $scope.noResponses=true;
                      $scope.isOpenDashBoard=false;
                    }
                    else{
                      $scope.noResponses=false;
                      $scope.isOpenDashBoard=true;
                    }
                  //  $scope.isOpenDashBoard=true;
                    //$scope.opened = true;
                    $scope.dashboardName="";
                   
                  }, function (){
                      messageCenterService.add('danger', 'Dashboard search failed', { timeout: 5000 });
                  }); 
    };
    
    /*
       User story Name:Provide advanced dashboard search capability -US15206
       Method name redirectToDashboard is used to redirect to dashboard screen for the selected ddashboard Name.
       Request Parameter : dashboard id 
       Response:
     */
    $scope.redirectToDashboard=function(dashboard){
      var url = '/?dashboardId='+dashboard._id['$oid'];         
      $location.url(url)
      $scope.isAdvSeachSectionShow=false;
    };
    $scope.hideAdvSearchContainer = function(){
        $scope.isAdvSeachSectionShow=false;
    };

  });