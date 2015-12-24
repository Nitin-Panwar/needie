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
    		//create dummy dashboard id when adding any metric to it
    		if(!$rootScope.placeholder.dashboard._id)
    		{
    			$rootScope.placeholder.dashboard._id=1;
    		}	
    		if(type === 'metric'){    			
    			var id = item;    			
    			$rootScope.myPromise = metricsFactory.get({metricId: id, filters: $rootScope.globalQuery}).$promise.then(function (data) {   				
    				// validate required size for metric card
    				var metric = data;
    				metric.size = {};
    				var sizeY = 1;

    				// standard x size
    				metric.size.x = 2;
    				// validate y size    				
    				var chars1 = 0;
    				var chars2 = 0;
    				// for (var i = 0; i < data.measures.length; i++) {
    				// 	if(data.measures[i].type === 'percentile'){
    				// 		sizeY = sizeY + 1;
    				// 		continue;
    				// 	}                        

    				// 	if((String(data.measures[i].value) + String(data.measures[i].unit)).length > String(data.measures[i].name).length){
    				// 		chars1 = (String(data.measures[i].value) + String(data.measures[i].unit)).length + 1 //add 1 to accomodate left and right margins
    				// 	}
    				// 	else{
    				// 		chars1 = String(data.measures[i].name).length + 1 //add 1 to accomodate left and right margins
    				// 	}    					

    				// 	if(chars1 + chars2 > 70){
    				// 		sizeY = sizeY + 1;    						
    				// 		chars2 = chars1;
    				// 	}
    				// 	else{
    				// 		chars2 = chars1 + chars2;
    				// 	}          
    				// }; 

    				if(data.distributions.length > 0){
                        sizeY = sizeY + 3;
                    }
                    // sizeY = data.distributions.length*2 + sizeY;    				
    				metric.size.y = sizeY;
                    

    				$rootScope.placeholder[type].push(metric);   
    				
    				messageCenterService.add('success', 'Metric added to dashboard', {timeout: 5000});
    			}, function (err) {
    				messageCenterService.add('danger', 'Could not add metric to dashbaord', {timeout: 5000});
    			})
    		}   

    	};

    	/**
    	 * This function removes an item from placeholder
    	 * @param  {[type]} type [description]
    	 * @param  {[type]} item [description]
    	 * @return {[type]}      [description]
    	 */
    	this.placeholderRemove = function (type, item) {    		
    		if(type === 'metric'){
    			var index = $rootScope.placeholder.metric.indexOf(item); 
                $rootScope.placeholder.metric.splice(index, 1);
    			messageCenterService.add('success','Removed from dashboard',{timeout: 3000})
    		}
    	}

    	/**
    	 * [createDBoard description]
    	 * @return {[type]} [description]
    	 */
    	this.createDBoard=function(){	
        
	      var dashboardObj = {};
	      dashboardObj.components = [];
	      var placeholder = {};
	      angular.copy($rootScope.placeholder, placeholder);
	      for (var i = 0; i < placeholder.metric.length; i++) {
	      	dashboardObj.components[i]=placeholder.metric[i];
	      	dashboardObj.components[i].type = 'metric';	   
	      	// delete distributions data;
	      	// delete dashboardObj.components[i].distributions;
	      };	      	      

	      // second handle textboxes
	      for (var i = 0; i < $rootScope.placeholder.textBoxes.length; i++) {	        	      	
	        dashboardObj.components[dashboardObj.components.length] = $rootScope.placeholder.textBoxes[i];	        
	      };

	      dashboardObj.name = $rootScope.placeholder.dashboard.name;
	      dashboardObj.description = $rootScope.placeholder.dashboard.description;
	      dashboardObj.filters = $rootScope.globalQuery;
	      dashboardObj.version = $rootScope.placeholder.dashboard.version + 1;

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
	        dashboardObj.owner = $rootScope.user;	        
	        $rootScope.myPromise=dashBoardsFactory.save({dashboard:dashboardObj}).$promise.then(function (data) {
	          var dashboardId = data['_id']['$oid'];
	          messageCenterService.add('success', 'Dashboard saved successfully', { timeout: 5000 }); 
	          //Save dashboardid in user metadata
	          $rootScope.myPromise= usersFactory.save({idsid:$rootScope.user,dashboardId:dashboardId}).$promise.then(function (data) {
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
