'use strict';

angular.module('sasaWebApp')
  .service('parentService', function ($location,$rootScope, metricsFactory, dashBoardsFactory, messageCenterService, usersFactory) {    
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
    				var metric = data;
                    data.size = {x: 2};                    
                    $rootScope.placeholder[type].push(data);
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
          if($rootScope.placeholder.dashboard.description){
            dashboardObj.description = $rootScope.placeholder.dashboard.description;  
          }
          else{
            dashboardObj.description = ""; 
          }
	      dashboardObj.filters = $rootScope.globalQuery;
	      dashboardObj.version = $rootScope.placeholder.dashboard.version + 1;
          dashboardObj.owner = $rootScope.user;

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
	        	
            console.log(dashboardObj)        
	        $rootScope.myPromise=dashBoardsFactory.save({dashboard:dashboardObj}).$promise.then(function (data) {
	          var dashboardId = data['_id']['$oid'];
              console.log(data)
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
            console.log(idsid,url)
            dashBoardsFactory.sendMail({idsid:idsid,url:url}).$promise.then(function (data) {
                messageCenterService.add('success','Email has been sent',{timeout:5000});              
              }, function (err) {
                messageCenterService.add('danger', 'Could not send email', {timeout: 10000});
            })
        };

        this.maxGridHeight = 0;
  });
