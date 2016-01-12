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
      $scope.save = function(flag){
        //for creating new dashboard 
        if(flag===true){
          $scope.save_dashboard = dashBoardsFactory.index().$promise.then(function(dashboards){            
            $scope.dashboardList = dashboards;
            for(var i=0;i<$scope.dashboardList.length;i++){
              if(data.name===$scope.dashboardList[i].name){
                messageCenterService.add('danger','Dashboard exists with same name.Please try different name.',{timeout: 10000});
                $scope.exist = true;
                $scope.dashboardUrl = $scope.dashboardList[i]['_id']['$oid']
                return;
              }
            }
            // Remove dashboard id for creating new dashboard
            delete $rootScope.placeholder.dashboard._id;
            $modalInstance.close(data);
          });
        }

        //For overwriting existing dashboard
        else{
          $scope.save_dashboard = dashBoardsFactory.index().$promise.then(function(dashboards){            
            $scope.dashboardList = dashboards;
            for(var i=0;i<$scope.dashboardList.length;i++){
              if(data.name===$scope.dashboardList[i].name){
                if($scope.OldName === data.name && $rootScope.placeholder.dashboard.owner === $rootScope.user){continue;}
                messageCenterService.add('danger','Dashboard exists with same name.Please try different name.',{timeout: 10000});
                $scope.exist = true;
                $scope.dashboardUrl = $scope.dashboardList[i]['_id']['$oid']
                return;
              }
            }
            $modalInstance.close(data);
          });
        }
        // in case its a new dashboard, create a new object for dashboard
        if($scope.OldName !== data.name){
          
        }

        // validate for existing dashboards with same name if current user is not dashboard owner
        // if($rootScope.placeholder.dashboard.owner !== $rootScope.user){          
        //   $scope.save_dashboard =  dashBoardsFactory.index().$promise.then(function(dashboards){            
        //     $scope.dashboardList = dashboards;
        //     for(var i=0;i<$scope.dashboardList.length;i++){
        //       if(data.name===$scope.dashboardList[i].name){
        //         messageCenterService.add('danger','Dashboard exists with same name.Please try different name.',{timeout: 10000});
        //         $scope.exist = true;
        //         $scope.dashboardUrl = $scope.dashboardList[i]['_id']['$oid']
        //         return;
        //       }
        //     }
        //     $modalInstance.close(data);
        //   });
        // }
        // else{
        //   $modalInstance.close(data);
        // }
              
      };
      
      /**
       * to close the dialog
       * @return {[type]} [description]
       */
      $scope.cancel = function(){

        $rootScope.placeholder.dashboard["name"] = $scope.OldName;
        $rootScope.placeholder.dashboard["description"] =  $scope.OldDescription;
        $modalInstance.dismiss('Canceled');
      
    }; 

  });
