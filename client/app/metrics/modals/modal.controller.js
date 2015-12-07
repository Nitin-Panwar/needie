'use strict';

angular.module('sasaWebApp')

.controller('ModalCtrl',function($scope,$modalInstance,data){
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

.config(['dialogsProvider','$translateProvider',function(dialogsProvider){
    dialogsProvider.useBackdrop(true);
    dialogsProvider.useEscClose(false);
    dialogsProvider.useCopy(false);
    dialogsProvider.setSize('la');
  }])//end config

  .run(['$templateCache',function($templateCache){
      $templateCache.put('/app/explore/modals/save.html');
      $templateCache.put('/app/explore/modals/actions.html');
      $templateCache.put('/app/explore/modals/data.html');
      $templateCache.put('/app/explore/modals/filter.html');
      $templateCache.put('/app/explore/modals/measures.html');
      $templateCache.put('/app/explore/modals/threshold.html');
      $templateCache.put('/app/explore/modals/metricDetails.html');
  }]);