'use strict';

angular.module('sasaWebApp')

.controller('ModalCtrl',function($scope,$modalInstance,data,$rootScope,metricsFactory){
      $scope.data = data;        
      $scope.dashBoard = {dashBoardName : ''};
      $scope.measureInfo = {};
		$scope.offset = 0;
      $scope.csvData = {};      
      $scope.availableColoumns = {
        items: [],
        selected: []
      };
      $scope.selectedColumns = {
        items: [],
        selected: []
      };

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

      $scope.getMe

      /**
 		* this function populates all metric columns
       * @param  {[type]} argument [description]
       * @return {[type]}          [description]
       */
      $scope.getMetricColumns = function (argument) {
        if($scope.availableColoumns.items.length !== 0){return;}
        console.info($scope.data.dataset);
        
        $rootScope.myPromise = metricsFactory.getColumns({dataset: $scope.data.dataset}).$promise.then(function (response) {                    
          var columns = response;
          for(var i in $scope.data.gridColumns){
              columns.splice(columns.indexOf($scope.data.gridColumns[i]), 1);
          }

          $scope.availableColoumns.items = columns;          

          if($scope.data.gridColumns){
            $scope.selectedColumns.items = $scope.data.gridColumns;
          }
        }, function (err) {
          console.error(err);          
        })
      };

      /**
       * these are options for data grid
       * @type {Object}
       */
      $scope.gridOptions = {
        enableSorting: true,
        enableColumnResizing: true,
        enableGridMenu: true,        
        exporterCsvFilename: $scope.data.name + '.csv',
        exporterPdfDefaultStyle: {fontSize: 9},
        exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
        exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
        exporterPdfHeader: { text: $scope.data.name, style: 'headerStyle' },
        exporterPdfFooter: function ( currentPage, pageCount ) {
          return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
        },
        exporterPdfCustomFormatter: function ( docDefinition ) {
          docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
          docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
          return docDefinition;
        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'A4',
        exporterPdfMaxGridWidth: 500,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        onRegisterApi: function(gridApi){
          $scope.gridApi = gridApi;
        },
        columnDefs: [],
        data: []
      };
	/**
       * this function gets raw metric data for selected columns
       * @return {[type]} [description]
       */
      $scope.getRawData = function (offset) {
        $scope.offset = offset;
        $scope.csvData.data = undefined;  
        $scope.gridOptions.data = [];      
        $scope.gridOptions.columnDefs = [];

        if($scope.selectedColumns.items.length === 0){
          messageCenterService.add('danger','Please select columns', {timeout: 10000});
          return;
        }

        var filters = angular.extend({}, $rootScope.globalQuery, data.filters);

        $rootScope.myPromise = metricsFactory.getRawData({fields: $scope.selectedColumns.items, metricId: $scope.data._id, filters: filters, offset: $scope.offset}).$promise.then(function (response) {          
          if(offset === 'all'){
            $scope.csvData.data = response;
            $scope.csvData.headers = Object.keys(response[0]);
            return;
          }

          $scope.gridOptions.data = response;       
          // create column definitions
          for (var column in $scope.selectedColumns.items){
            $scope.gridOptions.columnDefs.push({ name:$scope.selectedColumns.items[column], width:150, enablePinning:true })
          }
          console.info($scope.gridOptions);
        },function (err) {
          console.error(err);
        })        
      };

      $scope.exportCSV = function () {
        return metricsFactory.getRawData({})
      };
		

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
          case 'data':
            $modalInstance.close($scope.selectedColumns.items);
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


