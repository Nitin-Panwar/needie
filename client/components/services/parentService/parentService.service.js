'use strict';

angular.module('sasaWebApp')
  .service('parentService', function ($location,$rootScope, $http,metricsFactory, dashBoardsFactory, messageCenterService, usersFactory) {    
    //This function adds new items to placeholder
	this.placeholderAdd = function (type, item){
		//Creating dummy dashboard id before adding any metric to it
		if(!$rootScope.placeholder.dashboard._id)
		{ 
      $rootScope.createNew = false;
			$rootScope.placeholder.dashboard._id=1;
		}	

    //TO Create Copy of the existing metric card
    if(type === 'duplicatemetric'){
      var mdata = angular.copy(item)
      delete mdata.position
      delete mdata.size
      mdata.size = item.size
      $rootScope.placeholder['metric'].push(mdata);
    }

		if(type === 'metric'){    			
			 var id = item; 			
			$rootScope.myPromise = metricsFactory.get({metricId: id, filters: $rootScope.globalQuery,meta:$rootScope.meta}).$promise.then(function (data) {				
        data.size = {x: 2};
        data.type='metric'; 
        $rootScope.placeholder[type].push(data);

				messageCenterService.add('success',data.name +  ' metric is added to dashboard', {timeout: 5000});
			}, function (err) {
				messageCenterService.add('danger', 'Could not add metric to dashbaord', {timeout: 5000});
			})
		}   
	};

	//This function removes an item from placeholder
	this.placeholderRemove = function (type, item) {    	
   var itemName=angular.copy(item.name);	
		if(type === 'metric'){
			var index = $rootScope.placeholder.metric.indexOf(item); 
            $rootScope.placeholder.metric[index].name=undefined;
           
			messageCenterService.add('success', itemName +' metric is removed from dashboard',{timeout: 3000})
		}
	}

	//Function to create new dashboard
	this.createDBoard=function(){	
      var dashboardObj = {};
      dashboardObj.components = [];
      var placeholder = {};
      angular.copy($rootScope.placeholder, placeholder);
      for (var i = 0,j=0; i < placeholder.metric.length; i++) {
        if(placeholder.metric[i].name!==undefined){
            dashboardObj.components[j]=placeholder.metric[i];
            dashboardObj.components[j].type = 'metric';
            j=j+1;  
        }  
      };	      	      
      // second handle textboxes
      for (var i = 0; i < $rootScope.placeholder.textBoxes.length; i++) {	        	      	
        dashboardObj.components[dashboardObj.components.length] = $rootScope.placeholder.textBoxes[i];	        
      };
      dashboardObj.name = $rootScope.placeholder.dashboard.name;	      
      if($rootScope.placeholder.dashboard.description){
        dashboardObj.description = $rootScope.placeholder.dashboard.description;  
      }
      else{
        dashboardObj.description = ""; 
      }
      dashboardObj.filters = $rootScope.globalQuery;
      if($rootScope.placeholder.dashboard.version){
        dashboardObj.version = $rootScope.placeholder.dashboard.version + 1;
      }
      else{
        dashboardObj.version = 1;
      }
      dashboardObj.owner = $rootScope.user;
      //Saving meta data for score card
      dashboardObj.meta = $rootScope.meta;
      //Checking if the request is coming for update or create new.
      if($rootScope.placeholder.dashboard._id){	              
      	dashboardObj._id = $rootScope.placeholder.dashboard._id;            
        //Calling update dashboard factory service
        $rootScope.myPromise=dashBoardsFactory.update({dashBoard:dashboardObj}).$promise.then(function (data){
        	messageCenterService.add('success', 'Dashboard updated successfully', { timeout: 5000 });
      	},function (err) {
      		messageCenterService.add('danger','Not able to save dashboard',{timeout: 10000});
      	})
      }
      else{   	        
        $rootScope.myPromise=dashBoardsFactory.save({dashboard:dashboardObj}).$promise.then(function (data) {
          var dashboardId = data['_id'];
          messageCenterService.add('success', 'Dashboard saved successfully', { timeout: 5000 }); 
          //Save dashboardid in user metadata
          $rootScope.myPromise= usersFactory.save({idsid:$rootScope.user,dashboardId:dashboardId}).$promise.then(function (data) {
            $location.url('/?dashboardId='+dashboardId)
            messageCenterService.add('success','Dashboard added to favorites',{timeout:5000});	            
          }, function (err) {
          	messageCenterService.add('danger', 'Not able to add dashboard to favorites', {timeout: 10000});
          });
        },function (err) {
        	messageCenterService.add('danger','Not able to save dashboard', {timeout: 10000});
        });
      }
    };
    this.sendMail=function(idsid,url){
        dashBoardsFactory.sendMail({idsid:idsid,url:url}).$promise.then(function (data) {
            messageCenterService.add('success','Email has been sent',{timeout:5000});              
          }, function (err) {
            messageCenterService.add('danger', 'Could not send email', {timeout: 10000});
        })
    };
    this.maxGridHeight = 0;
});
