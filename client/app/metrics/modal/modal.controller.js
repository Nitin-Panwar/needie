'use strict';

angular.module('sasaWebApp')
  .controller('ModalCtrl', function ($scope,data,$rootScope,metricsFactory,filtersFactory,messageCenterService,$mdSelect,$mdDialog,tab) {
  $scope.showColumns = true;
  $scope.showApplyButton = false;
  $scope.validate = false;
  $scope.data = data;        
  $scope.dashBoard = {dashBoardName : ''};
  $scope.measureInfo = [];
  $scope.offset = 0;
  $scope.csvData = {};     
  $scope.tempThreshold ={}; 
  $scope.goal=[];
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
  $scope.allFilterData = {};
  $scope.tempData = {
    filterkey: '',
    filters:{}
  };
  $scope.isDisplayApplyBtn=false;
  $scope.isDisplayYaxisMessage=false;
  $scope.isDisplayUpDownBtn=false;
  $scope.displayNextBtn=0;
  /*
  Variable for advance visualization Dialog
   */  
  $scope.viz_details = {
    x_data:[],
    y_data:[],
    group_by:[],
    x_options:{},
    advance_viz:true
  };
  $scope.tab= tab;


  $scope.defaultViz = false;
  $scope.allfilterkeys=[];
  $scope.avData = {
    x_data: 'quarter',
    y_data: [],
    group_by: '',
    x_options:{"quarter":[1,2,3,4]},
    advance_viz:true,
    sortByyaxis:false,
    descOrder:false

  };
  if(data['distributions'] && data['distributions'][0]){
    for(var j=0; j < data['distributions'][0]['y_data'].length; j++){
      $scope.avData.y_data.push(data['distributions'][0]['y_data'][j]['label'])
    }
  }
  if(data['distributions'] && data['distributions'][0] && data['distributions'][0]['advance_viz'])
  {
      $scope.avData.x_data = data['distributions'][0]['x_data'][0]
      if(data['distributions'][0]['group_by'][0] !==undefined)
        $scope.avData.group_by=data['distributions'][0]['group_by'][0]
      else
        $scope.avData.group_by=''
      $scope.avData.x_options=data['distributions'][0]['x_options']
      $scope.avData.advance_viz=data['distributions'][0]['advance_viz']
      if(data['distributions'][0]['sortByyaxis']){
        $scope.avData.sortByyaxis = data['distributions'][0]['sortByyaxis'][0]['yaxis'];
        $scope.avData.descOrder = data['distributions'][0]['sortByyaxis'][0]['descOrder']
      }
  } 
  /*
  To set default Values in vizualization and filter tab
   */
  $scope.setDefaultValues = function(tab){
    if(tab==='visualization'){
      if($scope.defaultViz === false){
        $scope.defaultViz =true
        $scope.avData = {
          x_data: 'quarter',
          y_data: [],
          group_by: '',
          x_options:{"quarter":[1,2,3,4]},
          advance_viz:true,
          sortByyaxis:false,
          descOrder:false
        };
        for (var measure in data.measures){
          if(data.measures[measure].type !== 'mean' && data.measures[measure].type !== 'percentile' && data.measures[measure].type !== 'breakup' && data.measures[measure].type !=='percentage'){
            $scope.avData.y_data.push(data.measures[measure]['label'])
          }
        }
      }
      else{
        $scope.defaultViz = false
      }
    }
    else{
      $scope.filterQuery={}
      $scope.tempData.filters = {}
      $scope.tempData.filterkey = null
    }
  }
  
  
  //Toggles active state
  $scope.toggelActive = function (argument) {        
    if($scope.measureInfo[argument].active == undefined){
      $scope.measureInfo[argument].active = false;
    }
    else{
        $scope.measureInfo[argument].active = !$scope.measureInfo[argument].active;  
    }        
  }

  //This function populates all metric columns
  $scope.getMetricColumns = function (argument) {
    if(!$scope.data.gridColumns){
      $scope.data.gridColumns = [];
    }
    if($scope.data.gridColumns.length !== 0){
      $scope.selectedColumns.items = $scope.data.gridColumns;  
        if($scope.selectedColumns.items.length >= 2){
        $scope.isDisplayUpDownBtn=true;  
    } 
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
            if($scope.selectedColumns.items.length  >= 2){
                $scope.isDisplayUpDownBtn=true;
              }
        }
      }, function (err) {
        console.error(err);          
      })
    
    
  };

  //These are options for data grid
  $scope.gridOptions = {
    enableSorting: true,
    enableColumnResizing: true,
    enableGridMenu: false,        
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

  //This function gets raw metric data for selected columns
  $scope.getRawData = function (offset) {
    $scope.save($scope.tab);

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
    $rootScope.myPromise = metricsFactory.getRawData({fields: $scope.selectedColumns.items, metricId: $scope.data._id, filters: filters, offset: $scope.offset}).$promise.then(function (response) {          
      if(offset === 'all'){
        $scope.csvData.data = response;
       $scope.csvData.headers = Object.keys(response[0]);
        //$scope.csvData.headers = $scope.selectedColumns.items;

        /*
         Following three  line of code related to visable the grid with first 100 records
         when an user click on export buuton and disable the previous button and enable the next buttoon .
         */
        $scope.gridOptions.data = response.splice(0,100);
        $scope.offset =100;
        $scope.offset =0;

        return;
      }
      $scope.gridOptions.data = response; 
      $scope.displayNextBtn =response.length;     
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

    //To compare threshold vlaues
  $scope.compareThreshold = function(){
    for( var i in $scope.tempThreshold){
        if(($scope.tempThreshold[i].ua < $scope.tempThreshold[i].uw) || ($scope.tempThreshold[i].la > $scope.tempThreshold[i].lw))
        return true;    
    } 
  }

    //This function selets items to add to data grid
  $scope.dataGrid = function (item, boolean) {
    if(boolean){
        // select column to show in data grid
        for(var i in $scope.availableColoumns.selected) {
          $scope.selectedColumns.items.push($scope.availableColoumns.selected[i]);
            if($scope.selectedColumns.items.length >= 2){
              $scope.isDisplayUpDownBtn=true;
            }
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
          if($scope.selectedColumns.items.length < 2){
              $scope.isDisplayUpDownBtn=false;
            }   
        }
        $scope.selectedColumns.selected.length = 0;
    }
  };

  //This function selects columns to show in data grid
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
  /*
  Function to add or remove all columns in data Dialog
  @param {[type]} [either 'add' or 'remove']
   */
  $scope.AddRemoveColumns = function(type){
    if(type==='add'){
      $scope.isDisplayUpDownBtn=true;
      for(var i=0; i<$scope.availableColoumns.items.length; i++)
        $scope.selectedColumns.items.push($scope.availableColoumns.items[i])
        $scope.availableColoumns.selected = []
        $scope.availableColoumns.items=[]
    }
    else{
      $scope.isDisplayUpDownBtn=false;
       for(var i=0; i<$scope.selectedColumns.items.length; i++)
        $scope.availableColoumns.items.push($scope.selectedColumns.items[i])
        $scope.selectedColumns.selected = []
        $scope.selectedColumns.items=[]
    }
  }

  //Find unique items in an array by key      
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
  $scope.updateFilterQuery = function (key, tempFilter, type) {
      $scope.showApplyButton = true;
      if(type==='add')
      {
        for (var key in tempFilter)
          if(tempFilter[key].length !==0)
            $scope.filterQuery[key] = tempFilter[key]
            $scope.tempData.filterkey = null
            delete $scope.tempData.filters[key]
      }
      else{
        delete $scope.filterQuery[key]
      } 
      $scope.updateGlobalFilters();
  };

  /**
 * this function checks whether any item is in filter query
 * @param  {[type]} key   [description]
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
  $scope.isInQuery = function (key, value) {
    if($scope.filterQuery.hasOwnProperty(key)){
        return true
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
  /**
   * Function to set values of visualization when user click on apply
   */

  $scope.formatVizData = function() {
    // $scope.viz_details.sort_by = $scope.avData.sort_by;
    $scope.viz_details.sortByyaxis = [{yaxis:$scope.avData.sortByyaxis,descOrder:$scope.avData.descOrder}]
    
    $scope.viz_details.advance_viz = $scope.avData.advance_viz;
    
    if($scope.defaultViz === true){
      $scope.viz_details.x_data = ["quarter","month","year","work_week"]
    }
    else{
        $scope.viz_details.x_data.push($scope.avData.x_data);
        if($scope.avData.x_options.hasOwnProperty($scope.avData.x_data) && $scope.avData.x_options[$scope.avData.x_data].length >0 ){
          $scope.viz_details.x_options[$scope.avData.x_data] = $scope.avData.x_options[$scope.avData.x_data];
        }
        else
          $scope.viz_details.x_options[$scope.avData.x_data]=$scope.allFilterData[$scope.avData.x_data].filter(function(n){return n;});
        if($scope.avData.y_data.length ===1 && $scope.avData.group_by !== 'None' && $scope.avData.group_by !== ''){
          $scope.viz_details.group_by.push($scope.avData.group_by);
        }
    }
    for(var i=0; i<$scope.avData.y_data.length; i++){
      for (var key in data.measures ){
        if($scope.avData.y_data[i]===data.measures[key]['label']){
          $scope.viz_details.y_data[i]={}
          $scope.viz_details.y_data[i]['label']=data.measures[key]['label']
          $scope.viz_details.y_data[i]['conditions']=data.measures[key]['measure_mappings']['m1']['conditions']
          $scope.viz_details.y_data[i]['formula']=data.measures[key]['measure_mappings']['m1']['formula']   
        }
      }
    } 
  };

  $scope.getAllFilters = function(){
    if($scope.allfilterkeys.length>0)
      return;
    $rootScope.myPromise = metricsFactory.getFilters({filterId: $scope.data.metric_filter_id}).$promise.then(function (data) {                                                                    
        $scope.filterSubData = data.toJSON(); 
        // var filterKeys = Object.keys(data[0]);
        // for (var i = 0; i < filterKeys.length; i++) {               
        //     $scope.filterSubData[filterKeys[i]] = $scope.pluck($scope.FilterData12, filterKeys[i], null, null);
        // };   
        if(Object.keys($rootScope.GlobalFilters).length===0){
          $rootScope.myPromise = filtersFactory.getFilterData().$promise.then(function (data) {                                      
            $scope.FilterData = data.filters;   
            var filterKeys = Object.keys($scope.FilterData[0]);
            for (var i = 0; i < filterKeys.length; i++) {               
              $scope.allFilterData[filterKeys[i]] = $scope.pluck($scope.FilterData, filterKeys[i], null, null);
            }; 
            if($scope.navigationIcon()){
                $scope.updateGlobalFilters();
            }
            for (var key in $scope.filterSubData)     
            {
              $scope.allFilterData[key] = $scope.filterSubData[key]
              $scope.allfilterkeys = Object.keys($scope.allFilterData)
              $scope.tempData.filters[key] = []
            }   
          },function (err) {
              messageCenterService.add('danger', 'Could Not Load Filters', {timeout: 5000});
          });
        }
        else{
          for(var key in $rootScope.GlobalFilters)
           $scope.allFilterData[key]=$rootScope.GlobalFilters[key]
          for (var key in $scope.filterSubData)     
          {
            $scope.allFilterData[key] = $scope.filterSubData[key]
            $scope.allfilterkeys = Object.keys($scope.allFilterData)
            $scope.tempData.filters[key] = []
          } 
        }
      },function (err) {
        messageCenterService.add('danger', 'Could Not Load Filters', {timeout: 5000});
    });

    if(typeof($scope.data.filters) !== "object"){return;}
    
    if(Object.keys($scope.data.filters).length > 0){
        for(var key in $scope.data.filters){   
           $scope.filterQuery[key] = $scope.data.filters[key];
      }  
    }
  }

  $scope.isChecked = function(key,type) {
    if(type==="tempFilter" && $scope.tempData.filters[key] && $scope.filterSubData[key])
      return $scope.tempData.filters[key].length === $scope.filterSubData[key].length;  
    if(type==="Filter" && $scope.filterQuery[key] && $scope.filterSubData[key])
      return $scope.filterQuery[key].length === $scope.filterSubData[key].length;
  };

  $scope.toggleAll = function(key,type) {
    if(type==="tempFilter"){
        if ($scope.tempData.filters[key].length === $scope.filterSubData[key].length) 
        $scope.tempData.filters[key] = [];
      else
        $scope.tempData.filters[key] = $scope.filterSubData[key]
    }
    if(type==="Filter"){
        if ($scope.filterQuery[key].length === $scope.filterSubData[key].length) 
        $scope.filterQuery[key] = [];
      else
        $scope.filterQuery[key] = $scope.filterSubData[key]
    }
  };

  $scope.hide = function() {
    $mdDialog.hide();
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.save = function(which){
    $rootScope.placeholder.edited = true;
    switch(which){
      case 'measure':
        for( var i in $scope.measureInfo){
          $scope.measureInfo[i].goal=$scope.goal[i];
        }
        delete $scope.tempThreshold;
        delete $scope.goal;
        $scope.measureInfo['tab']=which
        $mdDialog.hide($scope.measureInfo);
        break;
      case 'data':
        $scope.selectedColumns.items['tab']=which
        //$mdDialog.hide($scope.selectedColumns.items);
        break;
      case 'filter':
        $scope.filterQuery['tab']=which
        if($scope.tempData.filters.hasOwnProperty($scope.tempData.filterkey)){
          $scope.filterQuery[$scope.tempData.filterkey]=$scope.tempData.filters[$scope.tempData.filterkey]
        }
        $mdDialog.hide($scope.filterQuery);
        break;
      case 'visualization':
        $scope.isDisplayYaxisMessage=false;
        $scope.formatVizData();
        $scope.viz_details['tab']=which;
         if($scope.avData.y_data.length === 0){
            $scope.isDisplayYaxisMessage=true;
         }
         else{
               $mdDialog.hide($scope.viz_details)
         }
        break;
      default:
        $mdDialog.hide();          
    }
  };


  $scope.navigationIcon=function(){
      for(var key in $rootScope.globalQuery){
          if($rootScope.globalQuery[key]!=undefined && key!='comment_type' )
               return true;
      }
  }

  $scope.updateGlobalFilters = function () {
      var data = $scope.FilterData;
      var dataHolder = [];
      for(var queryKey in $rootScope.globalQuery){          
        var tempArr = Object.keys(data[0])
        tempArr.splice(tempArr.indexOf(queryKey), 1);
        for(var i in $rootScope.globalQuery[queryKey]){
          for(var j in tempArr){
            var result = $scope.pluck(data, tempArr[j], queryKey, $rootScope.globalQuery[queryKey][i]);
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
        $scope.allFilterData[key] = dataHolder[key];
      }
    }

    $scope.moveDown=function(){
      //selectedColumns.items
     for(var i = 0; i < $scope.selectedColumns.selected.length; i++) {
            var idx = $scope.selectedColumns.items.indexOf($scope.selectedColumns.selected[i]);
            console.log(idx);
            if (idx < $scope.selectedColumns.items.length) {
                var itemToMove = $scope.selectedColumns.items.splice(idx, 1)
                console.log(itemToMove[0])
                $scope.selectedColumns.items.splice(idx+1, 0, itemToMove[0]);
                
            }
        }
      
    };
     $scope.moveUp=function(){
      //selectedColumns.items
     for(var i = 0; i < $scope.selectedColumns.selected.length; i++) {
            var idx = $scope.selectedColumns.items.indexOf($scope.selectedColumns.selected[i]);
            console.log(idx);
            if (idx > 0) {
                var itemToMove = $scope.selectedColumns.items.splice(idx, 1)
                console.log(itemToMove[0])
                $scope.selectedColumns.items.splice(idx-1, 0, itemToMove[0]);
                
            }
        }
    };
});

