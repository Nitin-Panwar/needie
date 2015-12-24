'use strict';

angular.module('sasaWebApp')

.controller('ModalCtrl',function($scope,$modalInstance,data,$rootScope,metricsFactory, messageCenterService){
      $scope.showColumns = true;
      $scope.showApplyButton = false;
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
		$scope.filterData = {};
      $scope.filterQuery = {};
      $scope.filterSubData = {};

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
 		* this function populates all metric columns
       * @param  {[type]} argument [description]
       * @return {[type]}          [description]
       */
      $scope.getMetricColumns = function (argument) {

        if(!$scope.data.gridColumns){$scope.data.gridColumns = [];}
        if($scope.data.gridColumns.length !== 0){          
          $scope.selectedColumns.items = $scope.data.gridColumns;    
          // return;
        }
        if($scope.availableColoumns.items.length !== 0){

          return;
        }       

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
        $scope.showColumns = false;

        if($scope.selectedColumns.items.length === 0){
          messageCenterService.add('danger','Please select columns', {timeout: 10000});
          return;
        }

        var filters = angular.extend({}, $rootScope.globalQuery, data.filters);

        $rootScope.metricPromise = metricsFactory.getRawData({fields: $scope.selectedColumns.items, metricId: $scope.data._id, filters: filters, offset: $scope.offset}).$promise.then(function (response) {          
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
		  case 'filter':
            $modalInstance.close($scope.filterQuery);
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
      };

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
      /**
       * gets metric filters
       * @return {[type]} [description]
       */
      $scope.getFilters = function () {        
        $rootScope.metricPromise = metricsFactory.getFilters({filterId: $scope.data.metric_filter_id}).$promise.then(function (data) {                                                                    
              $scope.FilterData = data;  
              var filterKeys = Object.keys(data[0]);
              for (var i = 0; i < filterKeys.length; i++) {               
                $scope.filterSubData[filterKeys[i]] = $scope.pluck($scope.FilterData, filterKeys[i], null, null);
              };                  

            }, 
            function (err) {
              messageCenterService.add('danger', 'Could Not Load Filters', {timeout: 5000});
        });
        
        if(Object.keys($scope.data.filters).length > 0){
          for(var key in $scope.data.filters){            
            $scope.filterQuery[key] = $scope.data.filters[key];
          }  
        }
      }

      /**
       * find unique items in an array by key      
       * @param  {[type]} array [description]
       * @param  {[type]} key   [description]
       * @return {[type]}       [description]
       */
      $scope.pluck = function(arr, key, matchKey, value) {
        if(value && matchKey){
          var result = $.map(arr, function(e) { 
            if(e[matchKey] === value)
            return e[key]; 
          });
        } 
        else{
          var result = $.map(arr, function(e) { return e[key]; });
        }
 
      //find unique values      
        var o = {}, i, l = result.length, r = [];
        for(i=0; i<l;i+=1) o[result[i]] = result[i];
        for(i in o) r.push(o[i]);       

        return r;
    }

      /**
       * This function updates filter query
       * @param  {[type]} key   [description]
       * @param  {[type]} value [description]
       * @return {[type]}       [description]
       */
      $scope.updateFilterQuery = function (key, value) {
          $scope.showApplyButton = true;
           // udpate global search query
          if($scope.filterQuery.hasOwnProperty(key)){

              // if the values exists                      
              var exists = false;
              var index = 0;
              for (var i = 0; i < $scope.filterQuery[key].length; i++) {
                  if($scope.filterQuery[key][i] == value){
                      index = i;                                           
                      exists = true;
                      break;
                  }
              }
              if(!exists)
              {               
                  $scope.filterQuery[key][$scope.filterQuery[key].length] = value;                  
              }
              else{
                  $scope.filterQuery[key].splice(index, 1);

                  if($scope.filterQuery[key].length === 0){

                      delete $scope.filterQuery[key];                      
                  }
              }                                                       
          }
          else{     
              
              $scope.filterQuery[key] = [value]             
          }                   
          $scope.updateGlobalFilters();          
      };

      /**
       * this function updates relational filter values
       */
      $scope.updateGlobalFilters = function () {
        if(Object.keys($scope.filterQuery).length == 0){          
          // $scope.state = false;
          $scope.showfilters = !$scope.showfilters;
          $scope.getFilters();  
        }

        var data = $scope.FilterData;
        var dataHolder = [];
        for(var queryKey in $scope.filterQuery){          
          var tempArr = Object.keys(data[0])
          tempArr.splice(tempArr.indexOf(queryKey), 1);
          for(var i in $scope.filterQuery[queryKey]){
            for(var j in tempArr){
              var result = $scope.pluck(data, tempArr[j], queryKey, $scope.filterQuery[queryKey][i]);
              if(dataHolder[tempArr[j]]){
              dataHolder[tempArr[j]] = dataHolder[tempArr[j]].concat(result)
              //find unique values      
                var o = {}, i, l = dataHolder[tempArr[j]].length, r = [];
                for(i=0; i<l;i+=1) o[dataHolder[tempArr[j]][i]] = dataHolder[tempArr[j]][i];
                for(i in o) r.push(o[i]);
                dataHolder[tempArr[j]] = r;
            }
            else{
              dataHolder[tempArr[j]] = result;
            }
            }
          } 
        }
        for(var key in dataHolder){
          $scope.filterSubData[key] = dataHolder[key];
        }
      }

      /**
       * this function checks whether any item is in filter query
       * @param  {[type]} key   [description]
       * @param  {[type]} value [description]
       * @return {[type]}       [description]
       */
      $scope.isInQuery = function (key, value) {
        if($scope.filterQuery.hasOwnProperty(key)){
            for (var i = 0; i < $scope.filterQuery[key].length; i++) {
                if($scope.filterQuery[key][i] == value){
                    return true;
                }
            };
        }
        return false;
    };

      /**
       * this function unselects all filter values
       * @param  {[type]} key [description]
       * @return {[type]}     [description]
       */
      $scope.unselectAllFilterValues = function (key) {
            delete $scope.filterQuery[key];
            $scope.updateGlobalFilters();
      };
      
    })


