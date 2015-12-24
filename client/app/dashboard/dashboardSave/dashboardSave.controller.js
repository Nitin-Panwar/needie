'use strict';

angular.module('sasaWebApp')
  .controller('DashboardSaveCtrl', function ($scope, data, $modalInstance, parentService, $rootScope) {
  	$scope.data = data;
  	$scope.OldName = $rootScope.placeholder.dashboard.name;
    $scope.OldDescription = $rootScope.placeholder.dashboard.description; 


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
        $modalInstance.close(data);
                
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
