'use strict';

angular.module('sasaWebApp')
  .controller('DataSourceCtrl', function ($scope,$rootScope) {
   
    //database type array
    $scope.dbType = [
      {'type':'mssql'},
      {'type':'postgres'},
      {'type':'others'}
    ];

    //database type description
    $scope.dbDescr = [
        {'lookupCode': 'mssql', 'description': 'MS SQL Server'},
        {'lookupCode': 'postgres', 'description': 'Post Gres'},
        {'lookupCode': 'others', 'description': 'Others'}
    ];

    /**
     * [this function sends ds object to backend through REST API]
     * @param  {[type]} form [description]
     * @return {[type]}      [description]
     */
  	$scope.saveDS = function (form) {
      if(form.$valid){  
        $scope.ds.created_on = Date.now();
        $scope.ds.modified_on = Date.now();     
  			$rootScope.promise=addDataSourceFactory.save({DataSource: $scope.ds}).$promise.then(function () {
          messageCenterService.add('success', 'DataSource Saved', { timeout: 5000 });
  			}, function () {
  				messageCenterService.add('danger', 'DataSource Save Failed', { timeout: 5000 });
  			});
  		}	
    };

    /**
     * [this function sends ds object to backend through REST API and test the connection]
     * @param  {[type]} form [description]
     * @return {[type]}      [description]
     */
    $scope.testConnection = function (form) {
      if(form.$valid){  
        $rootScope.promise=addDataSourceFactory.testConnection({DataSource: $scope.ds}).$promise.then(function (value) {
          if(value[0] === 'Y')
          {
            messageCenterService.add('success', 'Connection Successfull', { timeout: 5000 });
          }
          else{
            messageCenterService.add('danger', 'Test connection failed', { timeout: 5000 });
          }
        }, function () {
          messageCenterService.add('danger', 'Test connection failed', { timeout: 5000 });
        });
      } 
    };
  });
