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
  $scope.metricfilterData = {};
  $scope.allFilterData = {};
  $scope.tempData = {
    filterkey: '',
    filters:{}
  };
  $scope.isDisplayApplyBtn=false;
  $scope.isDisplayYaxisMessage=false;
  $scope.isDisplayUpDownBtn=false;
  $scope.displayNextBtn=0;
  $scope.isDisplayMeasureUnitMessage=false;
  $scope.isDisableApplyClick=false;
  $scope.myclass="applyBtnEnableMode";
  $scope.isGroupByOptionsApply=false;
  $scope.isGoalToBeSet=false;
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
  
    /*
      Description:function to reset the goal value of measure object 
    */
     function resetGoalSettingValue(){
       for(var i=0;i<data.measures.length;i++){
             if(data.measures[i].goal){
               data.measures[i].goal=undefined;
             }
         }
     }

   /*
   The below code is  check for wheather the gropu by is enable or not .
   */
       if(data.distributions && data.distributions[0] !== undefined && data.distributions[0].group_by !== undefined && data.distributions[0].group_by.length > 0 ){
       
         if(data.distributions[0].group_by.length > 0){
          $scope.gropuByOptions=data.distributions[0].group_by[0];
          $scope.isGroupByOptionsApply=true;
       }
       else{
        $scope.isGroupByOptionsApply=false;
       }
     }
   
   /*
        Code to find out x_data of distributions object and decide to display a
        meassage(**Goal can be set w.r.t. Work Week, Month and Quarter )
        in measure section.
        
   */
     if(data['distributions'] && data['distributions'][0] !== undefined && data['distributions'][0]['x_data'] !== undefined && data['distributions'][0]['x_data'].length > 0 )
          var x_data_goalToSetMsg=data['distributions'][0]['x_data'][0];
         if(x_data_goalToSetMsg === "quarter" || x_data_goalToSetMsg === "month" || x_data_goalToSetMsg === "work_week" || x_data_goalToSetMsg === "year"){
           $scope.isGoalToBeSet=true;
         }
         else{
           $scope.isGoalToBeSet=false;
         }
     

  
  // populate the data y-axis select from data.measure 
  if(data['distributions'] && data['distributions'][0]){
    for (var i=0;i<data.measures.length;i++){
      if(data.measures[i].distribution === true)
      $scope.avData.y_data.push(data.measures[i].label);
    }
  }
  if(data['distributions'] && data['distributions'][0] && data['distributions'][0]['advance_viz'])
  {
      $scope.avData.x_data = data['distributions'][0]['x_data'][0]
      if(data['distributions'][0]['group_by'][0] !== undefined)
        $scope.avData.group_by=data['distributions'][0]['group_by'][0]
      else
        $scope.avData.group_by = ''
      $scope.avData.x_options=data['distributions'][0]['x_options']
      $scope.avData.advance_viz=data['distributions'][0]['advance_viz']
      if(data['distributions'][0]['sortByyaxis']){
        $scope.avData.sortByyaxis = data['distributions'][0]['sortByyaxis'][0]['yaxis'];
        $scope.avData.descOrder = data['distributions'][0]['sortByyaxis'][0]['descOrder']
      }
  } 
  var loadingYdata=$scope.avData.y_data[0];
  /*
   To set default Values in vizualization and filter tab.Method will invoke
   when an user click on Reset button in filter and visualization modal
   */
  $scope.setDefaultValues = function(tab){
    $scope.isGroupByOptionsApply = false;
    if(tab==='visualization'){
       $scope.isDisplayMeasureUnitMessage=false;
        $scope.isDisableApplyClick=false;
        $scope.myclass="applyBtnEnableMode";
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
     for (var i=0;i<data.measures.length;i++){
              if(data.measures[i].distribution === true)
              $scope.avData.y_data.push(data.measures[i].label);
            }
          
        
      }
      else{
        $scope.defaultViz = false;
        $scope.avData = {
          y_data: []
        };
         for (var i=0;i<data.measures.length;i++){
              if(data.measures[i].distribution === true)
              $scope.avData.y_data.push(data.measures[i].label);
            }
          
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
  $scope.getMetricData = function(){
    //Retain the selected item columns after close the button in the modal
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
   $scope.getAddRemoveCoulmns=function(){
        $scope.showColumns = true;
   };
  /*
  This function gets raw metric data for selected columns and 
  invoke when user click on GET DATA and EXPORT CSV  button in data section.
  offset value is all means Export CSV button click
  offset value other tahn all means Get Data button click
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
    var temp;
    $rootScope.myPromise = metricsFactory.getRawData({fields: $scope.selectedColumns.items, metricId: $scope.data._id, filters: filters, offset: $scope.offset}).$promise.then(function (response) {          
      if(offset === 'all'){
        temp =angular.copy(response);
        $scope.csvData.data = temp;
       /*
       Following two line of codes for specifiy the columns order in export excel sheet by using csv-column-order property
       */
        $scope.csvData.headers =$scope.selectedColumns.items;
        $scope.csvData.columnsOrder=$scope.selectedColumns.items;

        /*
         Following three  line of code related to visable the grid with first 100 records
         when an user click on export buuton and disable the previous button and enable the next buttoon .
         */
        $scope.gridOptions.data=response.splice(0,100);
        $scope.offset =0;
        /*
         create grid column definitions while go  for  export excel data
         */
            for (var column in $scope.selectedColumns.items){
              $scope.gridOptions.columnDefs.push({ name:$scope.selectedColumns.items[column], width:150, enablePinning:true })
             }
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

   /*
    Method is not in used 
   */
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

    //This function selects items to add to data grid
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
     //   $scope.selectedColumns.items.length=1;

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
  $scope.firstIndex=0;
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
      $scope.firstIndex=$scope.selectedColumns.items.indexOf(item);
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
        $scope.availableColoumns.items=[];
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
   * Function to set values of visualization when user click on apply in case of visualization section
   */

  $scope.formatVizData = function() {
    // $scope.viz_details.sort_by = $scope.avData.sort_by;
    $scope.viz_details.sortByyaxis = [{yaxis:$scope.avData.sortByyaxis,descOrder:$scope.avData.descOrder}]
    
    $scope.viz_details.advance_viz = $scope.avData.advance_viz;
    
    if($scope.defaultViz === true && $scope.avData.x_data === 'quarter'){
      $scope.viz_details.x_data = ["quarter","month","year","work_week"]
    }
    else{
        $scope.viz_details.x_data.push($scope.avData.x_data);
        if($scope.avData.x_options.hasOwnProperty($scope.avData.x_data) && $scope.avData.x_options[$scope.avData.x_data].length >0 ){
          $scope.viz_details.x_options[$scope.avData.x_data] = $scope.avData.x_options[$scope.avData.x_data];
        }
        // else
          // $scope.viz_details.x_options[$scope.avData.x_data]=$scope.allFilterData[$scope.avData.x_data].filter(function(n){return n;});
        if($scope.avData.y_data.length ===1 && $scope.avData.group_by !== 'None' && $scope.avData.group_by !== ''){
          $scope.viz_details.group_by.push($scope.avData.group_by);
          
        }
    }
    if($scope.viz_details.group_by.length > 0){
      $scope.isGroupByOptionsApply=true;
    }
// need to pass distribution property true or false based on selection of y_data in visualization screen
      for (var key in data.measures ){
        for(var i=0; i<$scope.avData.y_data.length; i++){
        if($scope.avData.y_data[i]===data.measures[key]['label']){
          data.measures[key]['distribution'] =true;
          $scope.viz_details.y_data[i]={};
         $scope.viz_details.y_data[i]['label']=data.measures[key]['label'];
          break;
        }
        else{
          data.measures[key]['distribution'] =false;
        }
        
      }
    } 
    $scope.isDisableApplyClick=false;
    $scope.myclass="applyBtnEnableMode";


  };

 /*
   Method will invoke when user select filter options in metric card to load the default value for filter modal
 */
  $scope.getAllFilters = function(){
    if($scope.allfilterkeys.length>0)
      return;
    $rootScope.myPromise = metricsFactory.getFilters({filterId: $scope.data.metric_filter_id}).$promise.then(function (data) {  
         
        $scope.metricfilterData = data.toJSON();  
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
            for (var key in $scope.metricfilterData)     
            {
              $scope.allFilterData[key] = $scope.metricfilterData[key]
              $scope.allfilterkeys = Object.keys($scope.allFilterData)
              
              
            } 
            for(var key in $scope.allFilterData)
              $scope.tempData.filters[key] = []  
          },function (err) {
              messageCenterService.add('danger', 'Could Not Load Filters', {timeout: 5000});
          });
        }
        else{
          for(var key in $rootScope.GlobalFilters)
           $scope.allFilterData[key]=$rootScope.GlobalFilters[key]
          for (var key in $scope.metricfilterData)     
          {
            $scope.allFilterData[key] = $scope.metricfilterData[key]
            $scope.allfilterkeys = Object.keys($scope.allFilterData)
          } 
          for(var key in $scope.allFilterData)
            $scope.tempData.filters[key] = []
        }
        // To provide selectall check in filter options
        
       
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
    if(type==="tempFilter" && $scope.tempData.filters[key] && $scope.allFilterData[key])
      return $scope.tempData.filters[key].length === $scope.allFilterData[key].length;  
    if(type==="Filter" && $scope.filterQuery[key] && $scope.allFilterData[key])
      return $scope.filterQuery[key].length === $scope.allFilterData[key].length;
  };

  $scope.toggleAll = function(key,type) {
    if(type==="tempFilter"){
        if ($scope.tempData.filters[key].length === $scope.allFilterData[key].length) 
        $scope.tempData.filters[key] = [];
      else
        $scope.tempData.filters[key] = $scope.allFilterData[key]
    }
    if(type==="Filter"){
        if ($scope.filterQuery[key].length === $scope.allFilterData[key].length) 
        $scope.filterQuery[key] = [];
      else
        $scope.filterQuery[key] = $scope.allFilterData[key]
    }
  };

  $scope.hide = function() {
    $mdDialog.hide();
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

/*
   Method will invoke when user click on Apply button in the modal
 */
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
         $scope.selectedColumns.items['tab']=which;
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
        var updateYdata=$scope.avData.y_data[0]
           if(loadingYdata !== updateYdata){
              resetGoalSettingValue();
             }
             if($scope.isGroupByOptionsApply === true){
              resetGoalSettingValue();
             }
             if($scope.avData.y_data.length > 1){
              resetGoalSettingValue();
             }
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
 
 /*
method will invoke inside getAllFilters method.
*/
  $scope.navigationIcon=function(){
      for(var key in $rootScope.globalQuery){
          if($rootScope.globalQuery[key]!=undefined && key!='comment_type' )
               return true;
      }
  }

/*
method will invoke inside getAllFilters method.
*/
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

   /*
   method used for select an item and enable move down functioanlity in data modal
   */
    $scope.moveDown=function(){
    $scope.firstIndex++;  
     for(var i = 0; i < $scope.selectedColumns.selected.length; i++) {
            var idx = $scope.selectedColumns.items.indexOf($scope.selectedColumns.selected[i]);
            if (idx < $scope.selectedColumns.items.length) {
                var itemToMove = $scope.selectedColumns.items.splice(idx, 1)
                $scope.selectedColumns.items.splice(idx+1, 0, itemToMove[0]);
                
            }
        }
      
    };
    /*
     method used for select an item and enable move up functioanlity in data modal
     */
     $scope.moveUp=function(){
       $scope.firstIndex--;  
     for(var i = 0; i < $scope.selectedColumns.selected.length; i++) {
            var idx = $scope.selectedColumns.items.indexOf($scope.selectedColumns.selected[i]);
            if (idx > 0) {
                var itemToMove = $scope.selectedColumns.items.splice(idx, 1)
                $scope.selectedColumns.items.splice(idx-1, 0, itemToMove[0]);
                
            }
        }
    };

  

  /*
    checkMeasureUnit is used to Do not allow multiple measures with different units on Y-Axis
    
  */
  $scope.checkMeasureUnit=function(listOfmeasures){
     if($scope.isDisplayYaxisMessage && listOfmeasures.length > 0){
      $scope.isDisplayYaxisMessage=false;
     }
     var unit="";
     $scope.isDisplayMeasureUnitMessage=false;
    if(listOfmeasures.length === 1){
          $scope.isDisplayMeasureUnitMessage=false;
          $scope.isDisableApplyClick=false;
          $scope.myclass="applyBtnEnableMode";
          return;
    }
       for(var i=0;i<listOfmeasures.length;i++){
         for(var j=0;j<data.measures.length;j++){
            // unit =data.measures[0].unit;
              if(listOfmeasures[i] === data.measures[j].label){
                    if(unit.length === 0){
                      unit =data.measures[j].unit;
                    }
               if(unit === data.measures[j].unit){
                  $scope.isDisplayMeasureUnitMessage=false;
                  $scope.isDisableApplyClick=false;
                  $scope.myclass="applyBtnEnableMode";
               }
               else{
                $scope.isDisplayMeasureUnitMessage=true;
                $scope.isDisableApplyClick=true;
                $scope.myclass="applyBtnDisableMode";
                return;
                
               }
             }
         }
       }
  };



 /**
 * this function checks whether any item is in local filter query or global filter query and 
 * also maintain heirarchy of global filters in local filters. 
 * @param  {[type]} key   [description]
 * @return {[type]}       [description]
 */

    $scope.isInFilters=function(key){
      if(key==="product"){
        return true
      }
      $scope.globalfilterhierarchy = ["segment", "portfolio", "service", "service_component", "support_skill"]
      if($rootScope.globalQuery.hasOwnProperty(key) || $scope.filterQuery.hasOwnProperty(key)){
        return true
      }
      else{
        if($scope.globalfilterhierarchy.indexOf(key)>-1){
          var index = $scope.globalfilterhierarchy.indexOf(key)
          for (var key in $rootScope.globalQuery){
            if(index<$scope.globalfilterhierarchy.indexOf(key))
              return true
          }
        }
      }
      return false

    }
    
    $scope.swapFilterTab=function(){
     $scope.tab='filter';
     $scope.isDisableApplyClick=false;
     $scope.myclass="applyBtnEnableMode";
    };
    $scope.swapMeasureTab=function(){
     $scope.tab='measure';
     $scope.isDisableApplyClick=false;
     $scope.myclass="applyBtnEnableMode";
    };


});

