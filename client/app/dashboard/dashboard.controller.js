'use strict';

angular.module('sasaWebApp')
  .controller('DashboardCtrl', function ($scope, $rootScope, $stateParams, dashBoardsFactory, usersFactory, $location, messageCenterService, parentService, dialogs) {   
    
    $rootScope.placeholder={metric: [], textBoxes: [], dashboard: {}, edited: false}; 
    /**
  	 * Here system checks if there is an existing dashboard that user wants to see
  	 * @param  {[type]} $stateParams.dashboardId [description]
  	 * @return {[type]}                          [description]
  	 */    
    if($stateParams.dashboardId){
       $rootScope.createNew = false;
      //Making API call to get dashboard data
      $rootScope.myPromise = dashBoardsFactory.show({dashboardId:$stateParams.dashboardId, filters:{}}).$promise.then(function (data) {         
        $rootScope.placeholder.dashboard = data;  
        // update filters on front end
        $rootScope.globalQuery = $rootScope.placeholder.dashboard.filters;      

        //Add data to placeholder
        for(var i=0;i<data['components'].length;i++)
        {
          if(data['components'][i]['type']=='metric'){
            $rootScope.placeholder.metric.push(data['components'][i]);
          }
          if(data['components'][i]['type']=='textBox'){
            $rootScope.placeholder.textBoxes.push(data['components'][i]);
          }
        }        
        messageCenterService.add('success','Dashboard loaded successfully',{timeout: 10000});
      }, function (err) {
        messageCenterService.add('danger','Could not load dashboard',{timeout: 10000});
      });
    }

    /**
     * Print Dashboard to document
     * @param  {[type]} argument [description]
     * @return {[type]}          [description]
     */
    $scope.save2document = function (argument) {
      var url = $location.absUrl()
      var idsid = $rootScope.user;
      parentService.sendMail(idsid,url);  
    }


    /**
     * This function adds text boxes in placeholder
     */    
    $scope.addTextBox = function () {
      var obj = {
          size: { x: 1, y: 4 },          
          text: null,
          type:'textBox'
        };
      $rootScope.placeholder.textBoxes.push(obj);      
      $rootScope.placeholder.edited = true;
    };

    /**
     * this function removes text boxes
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    $scope.removeTextBox = function (item) {
      $rootScope.placeholder.textBoxes.splice($rootScope.placeholder.textBoxes.indexOf(item), 1);
      $rootScope.placeholder.edited = true;
    };

    /**
     * this function saves the dashboard
     * @return {[type]} [description]
     */ 
    $scope.launchSave = function () {  
      var dlg = dialogs.create('app/dashboard/dashboard_save_dialog.html','DashboardSaveCtrl', $rootScope.placeholder.dashboard,'sm');              
        dlg.result.then(function(data){
          $rootScope.placeholder.dashboard["name"] = data.name;
          $rootScope.placeholder.dashboard["description"] = data.description;
          parentService.createDBoard();
          $rootScope.placeholder.edited = false;
        });   
    }  

    $scope.$watch(function () {
          return $rootScope.closeLeftSidebar;
        }, function() {      
            $scope.closeLeftSideBar();
        }); 

    /**
     * this function sets a dashboard as homepage
     */
    $scope.setHomepage = function () {
      usersFactory.setHomepage({idsid: $rootScope.user, dashboardId: $rootScope.placeholder.dashboard._id}).$promise.then(function (data) {
        messageCenterService.add('success','Dashboard set as homepage',{timeout: 3000});
      },function (err) {
        messageCenterService.add('danger','Could not set dashboard as homepage', {timeout: 10000});
      })
    } 

    /**
     * Set a dashboard as favorite
     */
    $scope.setFavorite = function () {
      usersFactory.save({idsid: $rootScope.user, dashboardId: $rootScope.placeholder.dashboard._id}).$promise.then(function (data) {
        messageCenterService.add('success','Dashboard set as favorite',{timeout: 3000});
      },function (err) {
        messageCenterService.add('danger','Could not set dashboard as favorite',{timeout: 10000});
      });
    }

    /**
     * Delete a dashboard
     */
    $scope.delete = function(){
      // var name = prompt("Please enter dashboard name to confirm");
      var result = confirm("Do you really want to delete?");
      if (result) {
        $rootScope.myPromise = dashBoardsFactory.delete({idsid: $rootScope.user, dashboardId:$stateParams.dashboardId}).$promise.then(function (data) {         
          $rootScope.placeholder.dashboard = data; 
          $location.url('/')  
          $rootScope.placeholder={metric: [], textBoxes: [], dashboard: {}, edited: false}; 
          messageCenterService.add('success','Dashboard deleted successfully.',{timeout: 10000});
        }, function (err) {
          messageCenterService.add('danger','Could not delete dashboard.',{timeout: 10000});
        });
      }
    }
    /**
     *Below it watches for any changes in movement of metrics on the dashboard and resize
     *
     */
    $scope.gridsterDashboardOpts = {
      resizable: {
         enabled: true,
         handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
         start: function(event, $element, widget) {}, // optional callback fired when resize is started,
         resize: function(event, $element, widget) {}, // optional callback fired when item is resized,
         stop: function(event, $element, widget) {$rootScope.placeholder.edited = true;} // optional callback fired when item is finished resizing
      },
      draggable: {
         enabled: true, // whether dragging items is supported
         handle: '.mover-handle', // optional selector for resize handle
         start: function(event, $element, widget) {}, // optional callback fired when drag is started,
         drag: function(event, $element, widget) {}, // optional callback fired when item is moved,
         stop: function(event, $element, widget) {$rootScope.placeholder.edited = true;} // optional callback fired when item is finished dragging
      }
    };
    
    /**
     * [metricList description]
     * @return {[type]} [description]
     */
    $scope.metricList = function(){
      $scope.getMetricsList();
      $scope.state= true;
      $scope.metriclist =true;
      $scope.showmydashboards = false;
      $scope.showfilters = false;
    }  
    /**
     * This function closes left side bar 
     * @return {[type]} [description]
     */
    $scope.closeLeftSideBar = function(){
      $scope.state= false;
      $scope.metriclist =false;
      $scope.showmydashboards = false;
      $scope.showfilters = false;
      $rootScope.closeLeftSidebar =false;
    }
  });
