'use strict';

angular.module('sasaWebApp')
  .service('parentService', function ($rootScope, metricsFactory, dashBoardsFactory, messageCenterService, usersFactory) {    
    	/**
    	 * this function adds new items to placeholder
    	 * @param  {[type]} type [description]
    	 * @param  {[type]} item [description]
    	 * @return {[type]}      [description]
    	 */
    	this.placeholderAdd = function (type, item) {
    		if(type === 'metric'){
    			var id = item;    			
    			$rootScope.myPromise = metricsFactory.filterShow({metricID: id, filters: $rootScope.globalQuery}).$promise.then(function (data) { 
    				console.info(data);   				
    				$rootScope.placeholder[type].push(data);    				
    				messageCenterService.add('success', 'Metric added to dashboard', {timeout: 5000});
    			}, function (err) {
    				messageCenterService.add('danger', 'Could not add metric to dashbaord', {timeout: 5000});
    			})
    		}    		
    	};

    	/**
    	 * [createDBoard description]
    	 * @return {[type]} [description]
    	 */
    	this.createDBoard=function(){	      
	      var dashboardObj = {};
	      dashboardObj.components = [];
	      for (var i = 0; i < $rootScope.placeholder.metric.length; i++) {
	      	dashboardObj.components.push($rootScope.placeholder.metric[i]);
	      	dashboardObj.components[i].type = 'metric';	   
	      	// delete distributions data;
	      	delete dashboardObj.components[i].distributions;
	      };	      	      

	      // second handle textboxes
	      for (var i = 0; i < $rootScope.placeholder.textBoxes.length; i++) {	        
	        dashboardObj.components[dashboardObj.components.length] = $rootScope.placeholder.textboxes[i];	        
	      };

	      dashboardObj.name = $rootScope.placeholder.dashboard.name;
	      dashboardObj.filters = $rootScope.globalQuery;
	      dashboardObj.version = $rootScope.placeholder.dashboardVersion + 1;

	      //Checking if the request is coming for update or create new.
	      if($rootScope.placeholder.dashboard._id){
	                
	        //Creating temporary dashboard dict to save in mongo
	        dashboardObj.dashboardId = $rootScope.placeholder.dashboard._id;
	        console.info(dashboardObj);	        
	      	
	        //Calling update dashboard factory service
	        $rootScope.myPromise=dashBoardsFactory.update({dashBoard:dashboardObj}).$promise.then(function (data){
	        	messageCenterService.add('success', 'Dashboard updated successfully', { timeout: 5000 });
	      	},function (err) {
	      		messageCenterService.add('danger','Not able to save dashboard',{timeout: 10000});
	      	})
	      }
	      else{   	        
	        dashboardObj.owner = $rootScope.user;	        
	        $rootScope.myPromise=dashBoardsFactory.save({dashboard:dashboardObj}).$promise.then(function (data) {
	          var dashboardId = data['_id']['$oid'];
	          messageCenterService.add('success', 'Dashboard saved successfully', { timeout: 5000 }); 
	          //Save dashboardid in user metadata
	          $rootScope.myPromise= usersFactory.save({idsid:$rootScope.user,dashboardId:dashboardId,dashboardName:dashboardObj.name}).$promise.then(function (data) {
	            messageCenterService.add('success','Dashboard added to favorites',{timeout:5000});	            
	          }, function (err) {
	          	messageCenterService.add('danger', 'Not able to add dashboard to favorites', {timeout: 10000});
	          })
	        },function (err) {
	        	messageCenterService.add('danger','Not able to save dashboard', {timeout: 10000});
	        });
	      }
	    };

    
  });
