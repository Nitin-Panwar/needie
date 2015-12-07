'use strict';

var app = angular.module('sasaWebApp');

  app.controller('ExploreCtrl', function ($http,$scope,$timeout,usersFactory,exploreFactory,$rootScope,dashBoardsFactory,messageCenterService,dialogs,metricsFactory) {

    /**
     * Space placeholder variable to show data
     * @type {Object}
     *
     */   
    $scope.placeholder = {metric: [], workflow: [], DBoard: null, separators: [], textBoxes: []}; 
    $scope.showSearchBar=false;

    //Variable to show edit options 
    $scope.editDbVariable=false;
    
    /**
     * Load default explore data
     * @type {[type]}
     */
    $scope.exploreData = exploreFactory.index();

    /**
     * To Get all user specific favourite dashboards
     */
    $scope.myFavouriteDashboards= dashBoardsFactory.index();
    
    /**
     * [placeholderRemove description]
     * @param  {[type]} metricId    [description]
     * @param  {[type]} type        [description]
     * @param  {[type]} placeholder [description]
     * @return {[type]}             [description]
     */
    $scope.placeholderRemove=function(metricId,type,placeholder){
      //Warning: Change this code in future//Access scope variable 
      $scope.placeholder = placeholder;
      $scope.placeholder[type]=_.filter($scope.placeholder[type], function(item) {
        return !(item.id == metricId);
     });
      messageCenterService.add('success', 'Metric removed successfully', { timeout: 5000 });
    };

    /**
     * [edit function to modify dashboard]
     * @return {[type]} [description]
     */
    $scope.editDBoard=function(){
      $scope.editDbVariable=true;
    }

    /**
     * [To delete dashboard]
     * @return {[type]} [description]
     */
    $scope.deleteDashboard=function(dashboard){
      alert("Do you really want to delete this Dashboard");
      //Calling delete service to delete dashboard
      $rootScope.myPromise=dashBoardsFactory.delete({dashboardId:dashboard['$oid']}).$promise.then(function (data) {
      
      //Calling factory service to refresh dashboard list
      $scope.myFavouriteDashboards=dashBoardsFactory.index();
      //Adding messageCenterService after successfully deleting dashboard
      messageCenterService.add('success', 'Dashboard removed successfully', { timeout: 5000 });
     });
    }


    $scope.$watch(function() {
    return $rootScope.isFilterSet;},function(){
      if($rootScope.isFilterSet){
        $scope.getFilteredData();
        $rootScope.isFilterSet=false;
      }
    });

    //Function to get data after apllying filter 
    $scope.getFilteredData = function(){
      //To store metrics temporarily
      var tempMetrics= $scope.placeholder['metric']

      //Removing previously added values in placeholder
      $scope.placeholder={metric: [], workflow: [], DBoard:null, textBoxes: []}; 
      for (var i = 0; i < tempMetrics.length; i++) {
        $rootScope.myPromise=metricsFactory.filterShow({metricID:tempMetrics[i]['id'],filters:$rootScope.globalQuery}).$promise.then(function (data){
          var temp={id:data['id'],distributions:data['distributions'],measures:data['measures'],name:data['name'],type:'metric'}
          $scope.placeholder['metric'].push(temp);          
        });
      }
    }

    /***
     * [This function will send the dashboard id and gets dashbord details]
     * @param  {[type]} dashboardId [description]
     * @return {[type]}             [description]
     */
    $scope.getDashboard=function(dashboard){
      $rootScope.isFilterSet=false;
      $rootScope.dashboard=dashboard
      //To hide edit options
      $scope.editDbVariable=false;
      //Making API call to get dashboard data
      $scope.placeholder.metric.length = 0;
      $rootScope.myPromise=dashBoardsFactory.show({dashboardId:dashboard['$oid'],filters:$rootScope.globalQuery}).$promise.then(function (data) {
        //Removing previously added values in placeholder
        $scope.placeholder={metric: [], workflow: [], DBoard:null, textBoxes: [],dashboardId:dashboard['$oid']}; 

        //To remove search bar 
        $scope.showSearchBar=false;

        for(var i=0;i<data['components'].length;i++)
        {
          if(data['components'][i]['type']=='metric'){
            $scope.placeholder.metric.push(data['components'][i]);
          }
          if(data['components'][i]['type']=='textBox'){
            $scope.placeholder.textBoxes.push(data['components'][i]);
          }
        }
      })
    }

    /**
     * [For sidebar toggle]
     * @return {[type]} [description]
     */
    $scope.toggleState = function() {
     $scope.state = !$scope.state;
    };


    /**
     * provide searchable items for typeahead input     * 
     * @return {[type]} [description]
     */
    $scope.searchableItems = function () {
      var items = [];
      // Prepare metrics
      for (var i = 0; i < $scope.exploreData.length; i++) {        
        var name = $scope.exploreData[i]['name']
        if ($scope.exploreData[i]['alias']){
          name += " [" + $scope.exploreData[i]['alias'] + "]"
        }
        var obj1 = {name: name, id: $scope.exploreData[i]['_id']['$oid'], type:'metric',measures:$scope.exploreData[i]['measures'],distributions:$scope.exploreData[i]['distributions']};        
        items.push(obj1);        
      };
      return items;
    };          
    
    /**
     * This function adds searched metric and workflow items in the placeholder
     *
     */
    $scope.placeholderAdd = function (argument) {
      $rootScope.myPromise=metricsFactory.show({metricID:argument['id']}).$promise.then(function (data){
        var temp={id:data['_id'],distributions:data['distributions'],measures:data['measures'],name:data['name'],type:'metric'}
        $scope.searchedItem=null;
        // check if pass value is of type metric and workflow
        if(argument.type != 'DBoard'){
          // Add to placeholder arrays
          $scope.placeholder[argument.type].push(temp);
        }
        else{
          // Assign DBoard
          $scope.placeholder['DBoard'] = data.model;
        }
        messageCenterService.add('success', 'Metric added successfully', { timeout: 5000 });
      });
    };

    //Function for sidebar metric list
     $scope.metricKPI=function(item){
      var obj = {id: item['_id']['$oid'], type:'metric'};
      $scope.placeholderAdd(obj);
     }



    $scope.createNew=function(){
      // $http.get("http://letsmeet.intel.com/Resources/Dashboard/getuserdetails").success(function (response) {
      //   console.log(response)
      //   $scope.names = response.records;
      // });
      //To make dashobaord object empty 
      $rootScope.dashboard = {};   
      //To hide show options
      $scope.editDbVariable=true;
      //Removing previously
      //added values in placeholder
      $scope.placeholder={metric: [], workflow: [], DBoard: null, separators: [], textBoxes: [], homepage:0, favourite:0};
      //To show search bar
      $scope.showSearchBar=true;
    }

    /**
     * This function is used to add workflow metrics to placeholder
     * @param  {[type]} argument [description]
     * @return {[type]}          [description]
     */
    $scope.showworkflowmetric = function (argument) {
      // get metric Model
      var metric = $scope.getmetricById(argument);
      var name = metric.name;
      if(metric.alias){
        name += " [" + metric.alias + "]"
      }
      var obj = {name: name, model: metric, type:'metric'};
      $scope.placeholderAdd(obj);
    };

    /**
     * This function creates Discovery Board
     * @return {[type]} [description]
     */
    $scope.createDBoard = function () {
      $rootScope.isFilterSet=false;
      //creating shorthand for placeholder
      // usersFactory.show().$promise.then(function (date){
      //   console.log(data);
      // });
      var data = $scope.placeholder
      var obj = [];
      // first handle metrics
      for (var i = 0; i < data.metric.length; i++) {
        //Temporary dictionary to store metric in DB 
        var metric = {id:data.metric[i]['id'],type:data.metric[i]['type']};      
        obj.push(metric);
      };

      // second handle textboxes
      for (var i = 0; i < data.textBoxes.length; i++) {
        //Temporary dictionary to store textbox in DB
        var textBox = {id:data.textBoxes[i]['id'],type:data.textBoxes[i]['type']};          
        obj.push(textBox);
      };

      //Checking if the request is coming for update or create new.
      if($scope.placeholder['dashboardId']){
        //Creating temporary dashboard dict to save in mongo
        var dashboard={dashboardId:data['dashboardId'],components:obj};
        
        //Calling update dashboard factory service
        $rootScope.myPromise=dashBoardsFactory.update({dashBoard:dashboard}).$promise.then(function (data){
        messageCenterService.add('success', 'Dashboard removed successfully', { timeout: 5000 });
      })
      }
      else{
        // var dlg = dialogs.create('/dialogs/save.html','SaveCtrl',{},'lg');
        $scope.dashboardName = prompt("Enter Dashboard Name","");

        // dlg.result.then(function(dashBoardName){
        var dashboard={name:$scope.dashboardName,SOA:'test',description:'test',owner:'nitin',components:obj, homepage:0, favourite:0};
        
        $rootScope.myPromise=dashBoardsFactory.save({dashboard:dashboard}).$promise.then(function (data) {
          var dashboardId = data['_id']['$oid'];
          //To refresh list
          $scope.myFavouriteDashboards= dashBoardsFactory.index(); 
          messageCenterService.add('success', 'Dashboard saved successfully', { timeout: 5000 }); 
          
          console.log($scope.dashBoardName);
          //Save dashboardid in user metadata
          $rootScope.myPromise= usersFactory.save({idsid:'npanwar',dashboardId:dashboardId,dashboardName:$scope.dashboardName}).$promise.then(function (data) {
            messageCenterService.add('success','user metadata updated successfully',{timeout:5000});
          })
        });
        // });
      }
    };

    $scope.setDBoard = function(type) {
      console.log(type);
      var obj=[];
      if(type=='H'){
        $scope.dashboard={homepage:1};
        dashBoardsFactory.save({dashboard:$scope.dashboard}).$promise.then(function (data){
          $scope.placeholder = {metric: [], workflow: [], DBoard: null, separators: [], textBoxes: [], homepage:0, favourite:0}; 
          messageCenterService.add('success', 'Dashboard is saved as HomePage', { timeout: 5000 }); 
          });
      }
      else{
        console.log($scope.dashboard);
        $scope.dashboard.favourite=1;
        console.log($scope.dashboard);
        dashBoardsFactory.save({dashboard:$scope.dashboard}).$promise.then(function (data){
          $scope.placeholder = {metric: [], workflow: [], DBoard: null, separators: [], textBoxes: [], homepage:0, favourite:0}; 
          messageCenterService.add('success', 'Dashboard is saved as Favourite', { timeout: 5000 }); 
          });         
      }
    };
    /**
     * This function adds text boxes in placeholder
     */    
    $scope.addTextBoxes = function () {
      var obj = {
          size: { x: 1, y: 8 },          
          text: null,
          type:'textBox'
        };
      $scope.placeholder.textBoxes.push(obj);
    };
 }) 