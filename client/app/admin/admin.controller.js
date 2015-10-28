'use strict';

angular.module('sasaWebApp')
  .controller('AdminCtrl', function ($scope,$rootScope,dataSetFactory) {
    $scope.showDataSourceList=false;
    $scope.showDataSetList=false;

    /**
     * [To get the list of dataSorces]
     * @return {[type]} [description]
     */
  	$scope.listDataSources=function(){
      $scope.resetView();   
  		$rootScope.promise=dataSetFactory.index().$promise.then(function (data) {        
        $scope.dataSources= data;     
        $scope.showDataSource = true;   
      }, function () {
          messageCenterService.add('danger', 'DataSource indexing failed', { timeout: 5000 });
          console.error('DataSource indexing failed');
      });
    };   

    /**
     * [To Get the list of dataSets]
     * @return {[type]} [description]
     */
     $scope.listDataSets = function (){
      $scope.resetView();      
     	$rootScope.promise=dataSetFactory.getAllDataSet().$promise.then(function (data) {         
       	$scope.dataSets=data; 
        $scope.showDataSet = true;           
      }, function () {
          messageCenterService.add('danger', 'DataSet indexing failed', { timeout: 5000 });
          console.error('DataSet indexing failed');   
      });   
    };

    /**
     * [To reset view]
     * @param  {[type]} argument [description]
     * @return {[type]}          [description]
     */
    $scope.resetView = function (argument) {
      $scope.showDataSource = false;
      $scope.showDataSet = false; 
      $scope.defaultview = true;          
    }
});