'use strict';

angular.module('sasaWebApp')
  .controller('DashboardSaveCtrl', function ($scope, data, $modalInstance, parentService,messageCenterService, $rootScope,dashBoardsFactory) {
  	$scope.data = data;
  	$scope.OldName = $rootScope.placeholder.dashboard.name;
    $scope.OldDescription = $rootScope.placeholder.dashboard.description; 
    $scope.exist = false;

    /**
       * to apply the dialog
       * @param  {[type]} which [description]
       * @return {[type]}       [description]
       */
      $scope.save = function(){
        // in case its a new dashboard, create a new object for dashboard
        if($scope.OldName !== data.name){
          // if new name is assigned, remove old dashboard Id to save as new dashboard
          delete $rootScope.placeholder.dashboard._id;
        }
        // validate for existing dashboards with same name if current user is not dashboard owner
        if($rootScope.placeholder.dashboard.owner !== $rootScope.user){          
          $scope.save_dashboard =  dashBoardsFactory.index().$promise.then(function(dashboards){            
            $scope.dashboardList = dashboards;
            for(var i=0;i<$scope.dashboardList.length;i++){
              if(data.name===$scope.dashboardList[i].name){
                messageCenterService.add('danger','Dashboard exists with same name.Please try different name.',{timeout: 10000});
                $scope.exist = true;
                $scope.dashboardUrl = $scope.dashboardList[i]['_id']['$oid']
                return;
              }
            }
            $modalInstance.close(data);
          });
        }
        else{
          $modalInstance.close(data);
        }
              
      };
      
      /**
       * to close the dialog
       * @return {[type]} [description]
       */
      $scope.cancel = function(){

        $rootScope.placeholder.dashboard["name"] = $scope.OldName;
        $rootScope.placeholder.dashboard["description"] =  $scope.OldDescription;
        // parentService.createDBoard();
        
        $rootScope.placeholder.edited = false;
        $modalInstance.dismiss('Canceled');
      
    }; // end done

  });
