'use strict';

angular.module('sasaWebApp')
  .controller('DashboardCtrl', function ($scope, $rootScope, $stateParams, dashBoardsFactory, usersFactory, $http, messageCenterService, parentService, dialogs) {
  	$http.get("http://10.223.12.51:8099/getUser",{withCredentials:true}).success(function (response) {        
          $rootScope.user=response;        
        });     
    
    $rootScope.placeholder={metric: [], textBoxes: [], dashboard: {}, dashboardVersion: 0}; 

    /**
  	 * Here system checks if there is an existing dashboard that user wants to see
  	 * @param  {[type]} $stateParams.dashboardId [description]
  	 * @return {[type]}                          [description]
  	 */
    if($stateParams.dashboardId){
      // $scope.newDashboard = false;
      //Making API call to get dashboard data
      $rootScope.myPromise = dashBoardsFactory.show({dashboardId:$stateParams.dashboardId, filters:{}}).$promise.then(function (data) {         
        $scope.dashboard = data;          

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
        $rootScope.placeholder.dashboard = data; 
        console.info(data);
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
      var code = document.getElementById('dashboard').innerHTML;
      console.info(code);
    }

    /**
     * This function adds text boxes in placeholder
     */    
    $scope.addTextBox = function () {
      var obj = {
          size: { x: 1, y: 8 },          
          text: null,
          type:'textBox'
        };
      $rootScope.placeholder.textBoxes.push(obj);      
    };

    /**
     * this function removes text boxes
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    $scope.removeTextBox = function (item) {
      $rootScope.placeholder.textBoxes.splice($rootScope.placeholder.textBoxes.indexOf(item), 1);
    };

    /**
     * this function saves the dashboard
     * @return {[type]} [description]
     */ 
    $scope.launchSave = function () {
      console.info($scope.dashboard);
      var dlg = dialogs.create('/app/dashboard/dashboard_save_dialog.html','DashboardSaveCtrl', $scope.dashboard,'sm');              
        dlg.result.then(function(data){
          console.info(data);
        });  
    }    

    

  });
