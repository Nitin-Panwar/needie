'use strict';

angular.module('sasaWebApp')
  .controller('DashboardCtrl', function ($scope, $rootScope, $stateParams, dashBoardsFactory, usersFactory, $location, messageCenterService, parentService, dialogs) {   
    //Creating placeholder 
    $rootScope.placeholder={metric: [], textBoxes: [], dashboard: {}, edited: false}; 
    //For ng-switch
    $scope.view_types = ['metriccard', 'scorecard'];
    $rootScope.meta = {'details': [{'timeframe': 'historical','dimension': 'work_week','window_size': 15,"sequence":1},{'timeframe': 'historical','dimension': 'month','window_size': 0,"sequence":2},{'timeframe': 'historical','dimension': 'quarter','window_size': 0,"sequence":3}],'view_type': 'metriccard'}
    //Dictionary to store meta data of score card
    // $scope.scorecard_info={'previous':15,'scale':'WW'}
    //variable to watch, while changing score_card data
    $rootScope.var_changeData =0
    $rootScope.applyFilter = 0;
    //Getting screen size for responsive design 
    var screenWidth_temp = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    $scope.screenWidth = screenWidth_temp*(10/12)

    // $scope.view_type = $scope.meta.view_type;
    
    $rootScope.score_card_test =0;
    //Here system checks if there is an existing dashboard that user wants to see  
    if($stateParams.dashboardId){
       $rootScope.createNew = false;
      //Making API call to get dashboard data
      $rootScope.myPromise = dashBoardsFactory.show({dashboardId:$stateParams.dashboardId, filters:{}}).$promise.then(function (data) {         
        $rootScope.placeholder.dashboard = data; 
        if($rootScope.placeholder.dashboard.meta){
          $rootScope.meta =  $rootScope.placeholder.dashboard.meta
        }
  
        // update filters on front end
        $rootScope.globalQuery = $rootScope.placeholder.dashboard.filters;      
        //Add data to placeholder
        for(var i=0;i<data['components'].length;i++)
        {
          if(data['components'][i]['type']=='metric'){
            $rootScope.placeholder.metric.push(data['components'][i]);
          }
          if(data['components'][i]['type']=='textBox'){
            $rootScope.placeholder.textBoxes.push(data['components'][i]);
          }
        }  
        messageCenterService.add('success','Dashboard loaded successfully',{timeout: 10000});
      }, function (err) {
        messageCenterService.add('danger','Could not load dashboard',{timeout: 10000});
      });
    }

    // Print Dashboard to document
    $scope.save2document = function (argument) {
      var url = $location.absUrl()
      var idsid = $rootScope.user;
      parentService.sendMail(idsid,url);  
    }

    //This function adds text boxes in placeholder
    $scope.addTextBox = function () {
      var obj = {
          size: { x: 1, y: 4 },          
          text: null,
          type:'textBox'
        };
      $rootScope.placeholder.textBoxes.push(obj);      
      $rootScope.placeholder.edited = true;
    };

    //This function removes text boxes
    $scope.removeTextBox = function (item) {
      $rootScope.placeholder.textBoxes.splice($rootScope.placeholder.textBoxes.indexOf(item), 1);
      $rootScope.placeholder.edited = true;
    };

    //This function saves the dashboard
    $scope.launchSave = function () {
      var dlg = dialogs.create('app/dashboard/dashboard_save_dialog.html','DashboardSaveCtrl', $rootScope.placeholder.dashboard,'sm');              
        dlg.result.then(function(data){
          $rootScope.placeholder.dashboard["name"] = data.name;
          $rootScope.placeholder.dashboard["description"] = data.description;
          parentService.createDBoard();
          $rootScope.placeholder.edited = false;
        });   
    }  

    //Watch leftsidebar
    $scope.$watch(function () {
          return $rootScope.closeLeftSidebar;
        }, function() {      
            $scope.closeLeftSideBar();
        }
    ); 

    //This function sets a dashboard as homepage
    $scope.setHomepage = function () {
      usersFactory.setHomepage({idsid: $rootScope.user, dashboardId: $rootScope.placeholder.dashboard._id}).$promise.then(function (data) {
        messageCenterService.add('success','Dashboard set as homepage',{timeout: 3000});
      },function (err) {
        messageCenterService.add('danger','Could not set dashboard as homepage', {timeout: 10000});
      })
    } 

    //Set a dashboard as favorite
    $scope.setFavorite = function () {
      usersFactory.save({idsid: $rootScope.user, dashboardId: $rootScope.placeholder.dashboard._id}).$promise.then(function (data) {
        messageCenterService.add('success','Dashboard set as favorite',{timeout: 3000});
      },function (err) {
        messageCenterService.add('danger','Could not set dashboard as favorite',{timeout: 10000});
      });
    }

    //Delete a dashboard
    $scope.delete = function(){
      // var name = prompt("Please enter dashboard name to confirm");
      var result = confirm("Do you really want to delete?");
      if (result) {
        $rootScope.myPromise = dashBoardsFactory.delete({idsid: $rootScope.user, dashboardId:$stateParams.dashboardId}).$promise.then(function (data) {         
          $rootScope.placeholder.dashboard = data; 
          $location.url('/')  
          $rootScope.placeholder={metric: [], textBoxes: [], dashboard: {}, edited: false}; 
          messageCenterService.add('success','Dashboard deleted successfully.',{timeout: 10000});
        }, function (err) {
          messageCenterService.add('danger','Could not delete dashboard.',{timeout: 10000});
        });
      }
    }

    //Below it watches for any changes in movement of metrics on the dashboard and resize 
    $scope.gridsterDashboardOpts = {
      resizable: {
         enabled: true,
         handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
         start: function(event, $element, widget) {}, // optional callback fired when resize is started,
         resize: function(event, $element, widget) {}, // optional callback fired when item is resized,
         stop: function(event, $element, widget) {$rootScope.placeholder.edited = true;} // optional callback fired when item is finished resizing
      },
      draggable: {
         enabled: true, // whether dragging items is supported
         handle: '.mover-handle', // optional selector for resize handle
         start: function(event, $element, widget) {}, // optional callback fired when drag is started,
         drag: function(event, $element, widget) {}, // optional callback fired when item is moved,
         stop: function(event, $element, widget) {$rootScope.placeholder.edited = true;} // optional callback fired when item is finished dragging
      }
    };
    
    //To show metriclist and close other options 
    $scope.metricList = function(){
      $scope.getMetricsList();
      $scope.state= true;
      $scope.metriclist =true;
      $scope.showmydashboards = false;
      $scope.showfilters = false;
    }  

    //This function closes left side bar 
    $scope.closeLeftSideBar = function(){
      $scope.state= false;
      $scope.metriclist =false;
      $scope.showmydashboards = false;
      $scope.showfilters = false;
      $rootScope.closeLeftSidebar =false;
    }

    $scope.$watch('placeholder.metric', function(newValue, oldValue){
      //To stop unnessesry API call.
      if($rootScope.placeholder.metric.length==0){
        return;
      }
      //To call API when any metric is added or removed.
      if(newValue!==oldValue){
        console.log(oldValue,newValue)
        //Call function to get the score card data 
        $scope.transformData();
      }
    }, true);

    //Evaluate target is the function which is responsible to change the color
    //in score card format 
    $scope.evaluateTarget=function(measure,current_value,index){
      var work_weeks = $rootScope.meta.details[0].window_size
      var months = $rootScope.meta.details[1].window_size
      var quarters = $rootScope.meta.details[2].window_size
      if(measure.goal!==undefined && current_value!== '--'){
        //TO DO---Change it to actual scale
        if(measure.goal.scale=='work_week' && index < work_weeks){
          if(measure.goal.comparision==='<'){
            if(current_value < measure.goal.value){
              return false;
            }
            else{
              return true;
            } 
          }
          if(measure.goal.comparision==='<='){
            if(current_value <= measure.goal.value){
               return false;
            }
            else{
              return true;
            }
          }
          if(measure.goal.comparision==='>'){
            if(current_value > measure.goal.value){
               return false;
            }
            else{
               return true;
            } 
          }
          if(measure.goal.comparision==='>='){
            if(current_value >= measure.goal.value){
               return false;
            }
            else{
               return true;
            } 
          }
        }
        if(measure.goal.scale=='month' && index >= work_weeks && index < work_weeks+months ){
          if(measure.goal.comparision==='<'){
            if(current_value < measure.goal.value){
              return false;
            }
            else{
              return true;
            } 
          }
          if(measure.goal.comparision==='<='){
            if(current_value <= measure.goal.value){
               return false;
            }
            else{
              return true;
            }
          }
          if(measure.goal.comparision==='>'){
            if(current_value > measure.goal.value){
               return false;
            }
            else{
               return true;
            } 
          }
          if(measure.goal.comparision==='>='){
            if(current_value >= measure.goal.value){
               return false;
            }
            else{
               return true;
            } 
          }
        }
        if(measure.goal.scale=='quarter' && index >= work_weeks+months && index < work_weeks+months+quarters){
          if(measure.goal.comparision==='<'){
            if(current_value < measure.goal.value){
              return false;
            }
            else{
              return true;
            } 
          }
          if(measure.goal.comparision==='<='){
            if(current_value <= measure.goal.value){
               return false;
            }
            else{
              return true;
            }
          }
          if(measure.goal.comparision==='>'){
            if(current_value > measure.goal.value){
               return false;
            }
            else{
               return true;
            } 
          }
          if(measure.goal.comparision==='>='){
            if(current_value >= measure.goal.value){
               return false;
            }
            else{
               return true;
            } 
          }
        }
      }
      else{
        return false;
      } 
    }

    //rowspan calculator for score card
    $scope.rowspanCalculator = function (index) {
      var total = 1;
      if ($scope.measureList[index][0]) {        
        for (var i = index+1; i < $scope.measureList.length; i++) {
          if($scope.measureList[i][0] == ""){
            total = total + 1;
          }
          else{
            return total;
          }
        };
      };
      return total;
    }

    //This function changes score_card data
    $scope.changeCardData=function(){
      $rootScope.var_changeData=$rootScope.var_changeData+1;
    }

    //This function to check wheather a key,value pair exists in
    //passed object or not
    $scope.isExist=function(key,value,list){
      for (var i = 0; i < list.length; i++) {
        if(list[i][key]==value){
          return list[i]['value'].toFixed(0);
        }
      };
      return '--';
    }

    //Function to transform data to show in score card
    //TO Do -- Change 0,1,2 to metric,measure,data,goal 
    $scope.transformData=function(){
      //To get the current work-week,month,quarter 
      var current_work_week = $rootScope.scaleInfoData[0]['work_week']
      var current_month = $rootScope.scaleInfoData[0]['month']
      var current_quarter = $rootScope.scaleInfoData[0]['quarter']
      //To get the window size
      var window_size_work_week = $rootScope.meta.details[0].window_size;
      var window_size_month = $rootScope.meta.details[1].window_size;
      var window_size_quarter = $rootScope.meta.details[2].window_size;
      //Variable to store starting index
      $scope.start_index =current_work_week-window_size_work_week+1
      //Variable to show the header in score card
      $scope.scorecard_header = [];
      //Variable to store work_week header
      var scorecard_header_work_week =[];
      //Variable to store month header 
      var scorecard_header_month =[];
      //Variable to store quarter header
      var scorecard_header_quarter =[];
      for (var i=0,j=current_work_week-window_size_work_week+1; i<window_size_work_week; i++,j++) {
          scorecard_header_work_week[i]='WW'+j;
      }
      //Pushing scorecard_header_work_week in scorecard_header
      $scope.scorecard_header.push.apply($scope.scorecard_header,scorecard_header_work_week)
      for (var i=0,j=current_month-window_size_month+1; i<window_size_month; i++,j++) {
          scorecard_header_month[i]='M'+j;
      }
      //Pushing scorecard_header_month in scorecard_header
      $scope.scorecard_header.push.apply($scope.scorecard_header,scorecard_header_month)
      for (var i=0,j=current_quarter-window_size_quarter+1; i<window_size_quarter; i++,j++) {
          scorecard_header_quarter[i]='Q'+j;
      }
      //Pushing scorecard_header_quarter in scorecard_header
      $scope.scorecard_header.push.apply($scope.scorecard_header,scorecard_header_quarter)
      //To transform data 
      $scope.measureList =[]
      var metrics= $rootScope.placeholder.metric
      for (var i = 0; i<metrics.length; i++) {
        if(metrics[i].name!==undefined){
          for (var j = 0; j < metrics[i].measures.length; j++) {
          if(metrics[i].measures[j].scorecard_data){
            // console.log(metrics[i].measures[j].label,metrics[i].measures[j].scorecard_data.length)
            // if(metrics[i].measures[j].scorecard_data.length>0){
              if(j==0){
                var obj={0:metrics[i].alias,1:metrics[i].measures[j].label,2:metrics[i].measures[j].scorecard_data,'goal':metrics[i].measures[j].goal}
              }
              else{
                var obj={0:'',1:metrics[i].measures[j].label,2:metrics[i].measures[j].scorecard_data,'goal':metrics[i].measures[j].goal}
              }
              $scope.measureList.push(obj);
            // }
          }
          }
        } 
      };
      //Loop to handle missing values that are being passed from back end
      for (var i = 0; i < $scope.measureList.length; i++){
        var temp_array=[]
        var temp_array_ww=[]
        var temp_array_m=[]
        var temp_array_q=[]
        //Traversing work_week
        for (var k=0,j=current_work_week-window_size_work_week+1; k<window_size_work_week; k++,j++) {
          var key='work_week'
          var value=j
          temp_array_ww[k]=$scope.isExist(key,value,$scope.measureList[i]['2'])
        }
        //Pushing temp_array_ww into temp_array
        temp_array.push.apply(temp_array,temp_array_ww)
        //Traversing month
        for (var k=0,j=current_month-window_size_month+1; k<window_size_month; k++,j++) {
          var key='month'
          var value=j
          temp_array_m[k]=$scope.isExist(key,value,$scope.measureList[i]['2'])
        }
        //Pushing temp_array_m into temp_array
        temp_array.push.apply(temp_array,temp_array_m)
        //Traversing quarter
        for (var k=0,j=current_quarter-window_size_quarter+1; k<window_size_quarter; k++,j++) {
          var key='quarter'
          var value=j
          temp_array_q[k]=$scope.isExist(key,value,$scope.measureList[i]['2'])
        }
        //Pushing temp_array_q into temp_array
        temp_array.push.apply(temp_array,temp_array_q)
        //Replacing measureList's score_card data array from temp_array
        $scope.measureList[i]['2']= temp_array
      }
    }
  });
