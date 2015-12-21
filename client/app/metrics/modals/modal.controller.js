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


      $scope.availableColoumns = {
        items: ['column1','column2','column3','column4','column5','column6'],
        selected: []
      };
      $scope.selectedColumns = {
        items:[],
        selected: []
      };

      /**
       * this function selets items to add to data grid
       * @param  {[type]} item    [description]
       * @param  {[type]} boolean [description]
       * @return {[type]}         [description]
       */
      $scope.dataGrid = function (item, boolean) {
        if(boolean){
          // select column to show in data grid
          for(var i in $scope.availableColoumns.selected) {
            $scope.selectedColumns.items.push($scope.availableColoumns.selected[i]);
            $scope.availableColoumns.items.splice($scope.availableColoumns.items.indexOf($scope.availableColoumns.selected[i]), 1);            
          }
          $scope.availableColoumns.selected.length = 0;
        }
        else
        {
          // remove from selection
          for(var i in $scope.selectedColumns.selected){
            $scope.availableColoumns.items.push($scope.selectedColumns.selected[i]);
            $scope.selectedColumns.items.splice($scope.selectedColumns.items.indexOf($scope.selectedColumns.selected[i]), 1);    
          }
          $scope.selectedColumns.selected.length = 0;
        }
      }

      /**
       * this function selects columns to show in data grid
       * @param  {[type]} item    [description]
       * @param  {[type]} boolean [description]
       * @return {[type]}         [description]
       */
      $scope.selection = function (item, boolean) {
        if(boolean){          
          // select column to show in data grid          
          if($scope.availableColoumns.selected.indexOf(item) === -1){
            $scope.availableColoumns.selected.push(item);
          }
          else{
            $scope.availableColoumns.selected.splice($scope.availableColoumns.selected.indexOf(item), 1);  
          }
        }
        else
        {
          // remove from selection
          if($scope.selectedColumns.selected.indexOf(item) === -1){
            $scope.selectedColumns.selected.push(item);
          }
          else{
            $scope.selectedColumns.selected.splice($scope.selectedColumns.selected.indexOf(item), 1);  
          }
        }
      }
      
    })


