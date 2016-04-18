'use strict';

angular.module('sasaWebApp')
  .controller('DashboardCtrl', function ($scope, $rootScope, $stateParams, dashBoardsFactory, usersFactory, $location, messageCenterService, parentService, dialogs) {   
    
    //Creating placeholder 
    $rootScope.placeholder={metric: [], textBoxes: [], dashboard: {}, edited: false}; 
    
    //For ng-switch
    $scope.items = ['Metric card', 'Score card'];
    $scope.previous_numbers=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

    //Different scales to show data in score card format
    $scope.scales=['Work_week','Month','Quarter'];

    //Getting screen size for responsive design 
    var screenWidth_temp = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    $scope.screenWidth = screenWidth_temp*(11/12)
    //By dafault selected option from template
    $scope.selection = $scope.items[0];
    //Here system checks if there is an existing dashboard that user wants to see  
    if($stateParams.dashboardId){
       $rootScope.createNew = false;
      //Making API call to get dashboard data
      $rootScope.myPromise = dashBoardsFactory.show({dashboardId:$stateParams.dashboardId, filters:{}}).$promise.then(function (data) {         
        $rootScope.placeholder.dashboard = data;  
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

    //Dictionary to store meta data of score card
    $scope.scorecard_info={'previous':15,'scale':'WW','current':16}

    $scope.$watch('placeholder.metric', function(newValue, oldValue) {
      if(newValue!==oldValue){
        $scope.transformData();
      }
    }, true);

    //Evaluate target is the function which is responsible to change the color
    //in score card format 
    $scope.evaluateTarget=function(measure,current_value){
      if(measure.goal){
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
      else{
        return ;
      }
    }

    /**
     * row
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
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

    $scope.changeCardData=function(number,scale){
      console.log(number,scale)

    }

    //Function to transform data to show in score card
    //TO Do -- Change 0,1,2 to metric,measure,data,goal 
    $scope.transformData=function(){
      var scale= $scope.scorecard_info['scale']
      var previous = $scope.scorecard_info['previous']
      var current = $scope.scorecard_info['current']
      $scope.start_index =current-previous+1

      //To show the header in score card
      $scope.scorecard_header = []
      for (var i=0,j=current-previous+1; i< previous; i++,j++) {
          $scope.scorecard_header[i]=scale+j;
      }

      //To transform data 
      $scope.measureList =[]
      var metrics= $rootScope.placeholder.metric
  
      for (var i = 0; i<metrics.length; i++) {
        for (var j = 0; j < metrics[i].measures.length; j++) {
          if(metrics[i].measures[j].type=='number' && metrics[i].measures[j].scorecard_data){
            if(metrics[i].measures[j].scorecard_data.length>0){
              if(j==0){
                var obj={0:metrics[i].alias,1:metrics[i].measures[j].label,2:metrics[i].measures[j].scorecard_data,'goal':metrics[i].measures[j].goal}
              }
              else{
                var obj={0:'',1:metrics[i].measures[j].label,2:metrics[i].measures[j].scorecard_data,'goal':metrics[i].measures[j].goal}
              }
              $scope.measureList.push(obj);
            }
          }
        }
      };
      for (var i = 0; i < $scope.measureList.length; i++) {
        var temp_array=[]
        var flag = true;
        for (var j = 0; j < $scope.measureList[i]['2'].length; j++) {
          var pos =$scope.measureList[i]['2'][j]['work_week'];
          if(pos==current){
            flag = false;
          }
          temp_array[pos]= $scope.measureList[i]['2'][j]['value'];
        };
        if(flag){
          temp_array[current]= 0;
        }
        var temp_var=_.extend({}, temp_array)
        $scope.measureList[i]['2']= temp_var
      };
    }
  });
