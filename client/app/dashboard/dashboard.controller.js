'use strict';

angular.module('sasaWebApp')
  .controller('DashboardCtrl', function ($scope, $rootScope,$timeout, filtersFactory, $stateParams, dashBoardsFactory, usersFactory, $location, messageCenterService, parentService, dialogs,$mdDialog,webServiceURL,$http) {   
    //loading image
      //$scope.showLoading=true;
    //Creating placeholder 
    $rootScope.placeholder={metric: [], textBoxes: [], dashboard: {}, edited: false}; 
    //For ng-switch
    $scope.view_types = ['metriccard', 'scorecard'];
    //Dictionary to store meta data of score card
    $rootScope.meta = {'details': [{'timeframe': 'historical','dimension': 'work_week','window_size': 10,"sequence":1},{'timeframe': 'historical','dimension': 'month','window_size': 0,"sequence":2},{'timeframe': 'historical','dimension': 'quarter','window_size': 2,"sequence":3},{'timeframe': 'historical','dimension': 'year','window_size': 0,"sequence":4}],'view_type': 'metriccard'}
    //variable to watch, while changing score_card data
    $rootScope.var_changeData =0
    $rootScope.globalQuery = {}
    $rootScope.GlobalFilters ={}
    //Variable to check whether filte is applied or not
    $rootScope.applyFilter = 0;
    //Code to detect browser info.
    var objAgent = navigator.userAgent; 
    $scope.objbrowserName = navigator.appName;
    $scope.isDisableAction=false; 
    //In Chrome 
    if ((objAgent.indexOf("Chrome"))!=-1) { $scope.objbrowserName = "Chrome"; } 
    //In Microsoft internet explorer 
    else if ((objAgent.indexOf("MSIE"))!=-1) { $scope.objbrowserName = "Microsoft Internet Explorer";  } 
    // In Firefox 
    else if ((objAgent.indexOf("Firefox"))!=-1) { $scope.objbrowserName = "Firefox"; } 
    // In Safari 
    else if ((objAgent.indexOf("Safari"))!=-1) { $scope.objbrowserName = "Safari";  
    }  
    
   
    var listOfDashboard;
    $rootScope.score_card_test =0;
    //Here system checks if there is an existing dashboard that user wants to see  
    if($stateParams.dashboardId){
       $rootScope.createNew = false;
       var idsid=$rootScope.user;
      //Making API call to get dashboard data
        if(idsid === undefined){
               $rootScope.myPromise = $http.get(webServiceURL.loginUrl,{withCredentials:true}).then(function (response) {     
                      $rootScope.userDetails = response.data.user;
                      $rootScope.user = $rootScope.userDetails['idsid'].toLowerCase(); 
                      var idsid=$rootScope.user;
                      getDashboard(idsid);
                      
                      },function (err) {
                          // redirect user to access denied page
                          $location.url('/accessDenied')
                          messageCenterService.add('danger','Could not login!!!',{ status: messageCenterService.status.permanent });
                      }) 

        }
        else{
             getDashboard(idsid);
            }
    }

    function getDashboard(idsid){
         $rootScope.myPromise = dashBoardsFactory.show({idsid:idsid,dashboardId:$stateParams.dashboardId, filters:{}}).$promise.then(function (data) { 
                  $rootScope.placeholder.dashboard = data; 
                  listOfDashboard=angular.copy(data);//copy the dashboard list to a local variable for sending data to eam url list modal.

          /*
             Code for checking if any secured metric are there in the dashboard list ,
              if there disable some action  like save,send mail etc in metric card view  and display a warning 
              message in metric card and score card view 
              
            */
        if(data !== undefined && data.components !== undefined){
                  for(var i=0;i<data.components.length;i++){
                     if(data.components[i].secured !== undefined && data.components[i].secured){
                        $scope.isDisableAction=true;
                        break;
                     }
                  }
                }
        if($rootScope.placeholder.dashboard.meta){
          $rootScope.meta =  $rootScope.placeholder.dashboard.meta
          if(!$rootScope.meta.details[3]){
            $rootScope.meta.details[3] = {'timeframe': 'historical','dimension': 'year','window_size': 0,"sequence":4}
          }
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

    };

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
    
   /*
      if one of the metric is secured ,on click on entitlement button it will open a eam list modal 
      where we will see the metric name and its url
   */ 
   $scope.openUniqueEamListModal=function(){
                 $mdDialog.show({
                    controller: 'uniqueEamListController',
                        clickOutsideToClose: false,
                        templateUrl: 'app/template/uniqueEamList.html',
                        locals: {
                        item: listOfDashboard.components
                        }
                        
                     });
         
            
        };
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
     //var result1=$scope.showConfirm();
      //var result = confirm("Do you really want to delete?");
      // if (result) {
        $rootScope.myPromise = dashBoardsFactory.delete({idsid: $rootScope.user, dashboardId:$stateParams.dashboardId}).$promise.then(function (data) {         
        $rootScope.placeholder.dashboard = data; 
        $location.url('/')  
        $rootScope.placeholder={metric: [], textBoxes: [], dashboard: {}, edited: false}; 
         messageCenterService.add('success','Dashboard deleted successfully.',{timeout: 10000});
        }, function (err) {
          messageCenterService.add('danger','Could not delete dashboard.',{timeout: 10000});
        });
      // } 
    };
    $scope.deleteConfirm = function(event) {
               var confirm = $mdDialog.confirm()
                  .title('Are you sure to delete the dashboard?')
                  .textContent('Dashboard will be deleted permanently.')
                  .ariaLabel('TutorialsPoint.com')
                  .targetEvent(event)
                  .ok('Yes')
                  .cancel('No');
                  $mdDialog.show(confirm).then(function() {
                     $scope.status = 'Dashboard deleted successfully.';
                         $scope.delete();
                     }, function() {
                        $scope.status = 'Could not delete dashboard.';
                  });
            };
    $rootScope.resizeDone=false;
    //Below it watches for any changes in movement of metrics on the dashboard and resize 
    $scope.gridsterDashboardOpts = {
      resizable: {
         enabled: true,
         handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
         start: function(event, $element, widget) {
          $rootScope.resizeDone=true;
         }, // optional callback fired when resize is started,
         resize: function(event, $element, widget) {
          //console.log("i am here");
           

         }, // optional callback fired when item is resized,
         stop: function(event, $element, widget) {
          $rootScope.$broadcast('myCustomeEvent',"data");
            $rootScope.resizeDone=true;
            $rootScope.placeholder.edited = true;
         // console.log($rootScope.placeholder.edited);
         } // optional callback fired when item is finished resizing
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
        if(measure.goal.scale=='quarter' && index < quarters){
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
        if(measure.goal.scale=='month' && index >= quarters && index < quarters+months ){
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
        if(measure.goal.scale=='work_week' && index >= quarters+months && index < work_weeks+months+quarters){
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
          if(list[i]['value'] != '--' && list[i]['value'] != "None"){
            return list[i]['value'].toFixed(0);
          } 
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
      var current_year = $rootScope.scaleInfoData[0]['year']
      var previous_year = current_year - 1
      //To get the window size
      var window_size_work_week = $rootScope.meta.details[0].window_size;
      var window_size_month = $rootScope.meta.details[1].window_size;
      var window_size_quarter = $rootScope.meta.details[2].window_size;
      var window_size_year =0;

      //This is a temp fix; Plz remove it once patching is done.
      if(!$rootScope.meta.details[3]){
        $rootScope.meta.details[3] = {'timeframe': 'historical','dimension': 'year','window_size': 0,"sequence":4}
      }
      else{
        window_size_year = $rootScope.meta.details[3].window_size;
      }
      
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
      //Variable to store year header
      var scorecard_header_year =[];

      for (var i=0; i < window_size_year ; i++) {
          scorecard_header_year[i] = String(current_year - window_size_year + i +1)
        }
      //Pushing scorecard_header_quarter in scorecard_header
      $scope.scorecard_header.push.apply($scope.scorecard_header,scorecard_header_year)

      for (var i=0,j=current_quarter-window_size_quarter+1; i<window_size_quarter; i++,j++) {
        if(j>0){
          scorecard_header_quarter[i]='Q'+j+" "+current_year;
        }
        else{
          var temp = j+4;
          scorecard_header_quarter[i]='Q'+temp+" "+previous_year;
        }
      }
      //Pushing scorecard_header_quarter in scorecard_header
      $scope.scorecard_header.push.apply($scope.scorecard_header,scorecard_header_quarter)
      for (var i=0,j=current_month-window_size_month+1; i<window_size_month; i++,j++) {
        if(j>0){
          scorecard_header_month[i]='M'+j+" "+current_year;
        }
        else{
          var temp = j+12;
          scorecard_header_month[i]='M'+temp+" "+previous_year;
        }
      }
      //Pushing scorecard_header_month in scorecard_header
      $scope.scorecard_header.push.apply($scope.scorecard_header,scorecard_header_month)
      for (var i=0,j=current_work_week-window_size_work_week+1; i<window_size_work_week; i++,j++) {
        if(j>0){
          scorecard_header_work_week[i]='WW'+j+" "+current_year;
        }
        else{ 
          var temp = j+52;
          scorecard_header_work_week[i]='WW'+temp+" "+previous_year;
        }
      }
      //Pushing scorecard_header_work_week in scorecard_header
      $scope.scorecard_header.push.apply($scope.scorecard_header,scorecard_header_work_week)
      
      //To transform data 
      $scope.measureList =[]
      var metrics= $rootScope.placeholder.metric
      //console.log(metrics);
      for (var i = 0; i<metrics.length; i++) {
        if(metrics[i].name!==undefined){
          var k=true;
          if(!angular.isUndefined(metrics[i].measures)){
          for (var j = 0; j < metrics[i].measures.length;j++) {
          if(metrics[i].measures[j].scorecard_data && metrics[i].measures[j].active && metrics[i].measures[j].plottable){
            if(k){
              var obj={0:metrics[i].alias,1:metrics[i].measures[j].label,2:metrics[i].measures[j].scorecard_data,'goal':metrics[i].measures[j].goal,'unit':metrics[i].measures[j].unit}
              k=false
            }
            else{
              var obj={0:'',1:metrics[i].measures[j].label,2:metrics[i].measures[j].scorecard_data,'goal':metrics[i].measures[j].goal,'unit':metrics[i].measures[j].unit}
            }
            $scope.measureList.push(obj);
          }
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
        var temp_array_y=[]
        //Traversing year
        for (var k=0,j=current_year-window_size_year+1; k<window_size_year; k++,j++) {
          var key='year'
          var value=j
          temp_array_y[k]=$scope.isExist(key,value,$scope.measureList[i]['2'])
        }
        //Pushing temp_array_q into temp_array
        temp_array.push.apply(temp_array,temp_array_y)
        //Traversing quarter
        if(current_quarter-window_size_quarter+1>0){
          for (var k=0,j=current_quarter-window_size_quarter+1; k<window_size_quarter; k++,j++) {
            var key='quarter'
            var value=j
            temp_array_q[k]=$scope.isExist(key,value,$scope.measureList[i]['2'])
          }
        }
        else{
          for (var k=0,j=current_quarter-window_size_quarter+1; k<window_size_quarter; k++,j++) {
            var year = current_year
            var temp = j
            if(j<=0){
              var year = previous_year
              temp = j+4;
            }
            var key = 'yyyyqq';
            var value = parseInt(year+'0'+temp);
            temp_array_q[k]=$scope.isExist(key,value,$scope.measureList[i]['2']) 
          } 
        }
        //Pushing temp_array_q into temp_array
        temp_array.push.apply(temp_array,temp_array_q)
        //Traversing month
        if(current_month-window_size_month+1>0){
          for (var k=0,j=current_month-window_size_month+1; k<window_size_month; k++,j++) {
              var key='month'
              var value=j
              temp_array_m[k]=$scope.isExist(key,value,$scope.measureList[i]['2'])
            }
        }
        else{
          for (var k=0,j=current_month-window_size_month+1; k<window_size_month; k++,j++) {
              var year = current_year
              var temp = j;
              if(j<=0){
                var year = previous_year
                temp = j+12;
              }
              var key ='yyyymm';
              if(temp<10){
                var value = parseInt(year+'0'+temp);
              }
              else{
                var value = parseInt(year+''+temp);
              }
              temp_array_m[k]=$scope.isExist(key,value,$scope.measureList[i]['2'])
            }
        }
        //Pushing temp_array_m into temp_array
        temp_array.push.apply(temp_array,temp_array_m)
        //Traversing work_week
        if(current_work_week-window_size_work_week+1>0){
          for (var k=0,j=current_work_week-window_size_work_week+1; k<window_size_work_week; k++,j++) {
            var key='work_week'
            var value=j
            temp_array_ww[k]=$scope.isExist(key,value,$scope.measureList[i]['2'])
          }
        }
        else{
          for (var k=0,j=current_work_week-window_size_work_week+1; k<window_size_work_week; k++,j++) {
            var year = current_year
            var temp = j;
            if(j<=0){
              var year = previous_year
              temp = j+52;
            }
            var key='yyyyww'
            if(temp<10){
              var value=parseInt(year+'0'+temp);
            }
            else{
              var value=parseInt(year+''+temp);
            }
            temp_array_ww[k]=$scope.isExist(key,value,$scope.measureList[i]['2'])
          }
        }
        //Pushing temp_array_ww into temp_array
        temp_array.push.apply(temp_array,temp_array_ww)
        //Replacing measureList's score_card data array from temp_array
        $scope.measureList[i]['2']= temp_array
      }
    }
    // $('#dashboardArea').bind('click', function(event){
    //   closeLeftSidebar()
    // })
  });