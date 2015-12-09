'use strict';

angular.module('sasaWebApp')

.controller('ModalCtrl',function($scope,$modalInstance,data,$rootScope){
      $scope.data = data;  
      $scope.dashBoard = {dashBoardName : ''};
      $scope.measureInfo = {};

      /**
       * toggles active state
       * @param  {[type]} argument [description]
       * @return {[type]}          [description]
       */
      $scope.toggelActive = function (argument) {        
        if($scope.measureInfo[argument].active == undefined){
          $scope.measureInfo[argument].active = false;
        }
        else{
          $scope.measureInfo[argument].active = !$scope.measureInfo[argument].active;  
        }        
      }

      /**
       * to apply the dialog
       * @param  {[type]} which [description]
       * @return {[type]}       [description]
       */
      $scope.save = function(which){
        $rootScope.placeholder.edited = true;
        switch(which){
          case 'saveDBName':
            $modalInstance.close($scope.dashBoard.dashBoardName);
            break;
          case 'measure':
            $modalInstance.close($scope.measureInfo);
            break;
          default:
            $modalInstance.close();          
        }
      };
      
      /**
       * to close the dialog
       * @return {[type]} [description]
       */
      $scope.cancel = function(){
        $modalInstance.dismiss('Canceled');
      }; // end done
      
    })


