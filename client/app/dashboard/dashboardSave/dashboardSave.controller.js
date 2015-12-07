'use strict';

angular.module('sasaWebApp')
  .controller('DashboardSaveCtrl', function ($scope, data, $modalInstance, parentService, $rootScope) {
  	$scope.data = data;
  	$scope.OldName = $rootScope.placeholder.dashboard.name;

    /**
       * to apply the dialog
       * @param  {[type]} which [description]
       * @return {[type]}       [description]
       */
      $scope.save = function(){
      	$rootScope.placeholder.dashboard.name = data.name;
        $rootScope.placeholder.dashboard.description = data.description;
        parentService.createDBoard();
        $scope.cancel();
      };
      
      /**
       * to close the dialog
       * @return {[type]} [description]
       */
      $scope.cancel = function(){
        $modalInstance.dismiss('Canceled');
      }; // end done
  });
