'use strict';

angular.module('sasaWebApp')
  .directive('leftSidebar', function ($rootScope, filtersFactory, messageCenterService, $stateParams, workflow, parentService, usersFactory) {
    return {
      templateUrl: 'components/directives/left-sidebar/left-sidebar.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {


      	/**
      	 * this variable validates whether filter has been applied.
      	 * @type {Number}
      	 */
      	$rootScope.applyFilter = 0;

      	/**
      	 * this function toggles the sidebar
      	 * @type {Boolean}
      	 */
      	scope.state = false;
	    scope.toggleState = function() {	    	
	    	// scope.state = scope.showmydashboards || scope.metriclist || scope.showfilters;
	    	// // if sidebar is closed, reset colors.
	    	// if(!scope.state){
	    	// 	scope.reset();
	    	// }	    		    	
	    	toggleSideBar();
	    };

	    /**
	     * [TO show yellow icon if any value is selected]
	     * @return {[type]} [description]
	     */
	    scope.navigationIcon=function(){
	        for(var key in $rootScope.globalQuery){
	            if($rootScope.globalQuery[key]!=undefined && key!='comment_type' )
	                 return true;
	        }
	    }


	    function toggleSideBar () {
	    	scope.state = scope.showmydashboards || scope.metriclist || scope.showfilters;	    	
	    	// if sidebar is closed, reset colors.
	    	if(!scope.state){
	    		scope.reset();
	    	}
	    };

	    /**
	     * this function gets users fav dashboards
	     * @param  {[type]} argument [description]
	     * @return {[type]}          [description]
	     */
	    scope.getUserDashboards = function (argument) {
	    	scope.showmydashboards = !scope.showmydashboards;	    	
	    	if(scope.showmydashboards){
	    		scope.metriclist = false;
	    		scope.showfilters = false;
	    	}	    	

	    	$rootScope.myPromise= usersFactory.get({user:$rootScope.user}).$promise.then(function (data) {		    		
	          	scope.myDashboardsList=data['dashboards'];
	        }, function (){
	          	messageCenterService.add('danger', 'No Data found', { timeout: 5000 });
	        })
	    };

	    /**
	     * this function gets a list of metrics and their workflows
	     * @param  {[type]} argument [description]
	     * @return {[type]}          [description]
	     */
	    scope.getMetricsList = function () {
	    	getMetrics();
	    }
	    function getMetrics() {
	    	scope.metriclist = !scope.metriclist;	    	
	    	if(scope.metriclist){
	    		scope.showmydashboards = false;
	    		scope.showfilters = false;
	    	}

	    	workflow.get().$promise.then(function (data) {
	    		scope.dashboardList = data;
	    	},function (err) {
	    		messageCenterService.add('danger', 'Could Not Load Metrics', {timeout: 5000});	    		
	    	});
	    }

	    /**
	     * adds metrics to dashboard
	     * @param {[type]} argument [description]
	     */
	    scope.addMetric2Dashboard = function (argument) {
	    	parentService.placeholderAdd('metric',argument);
	    	$rootScope.placeholder.edited = true;
	    	scope.metriclist = !scope.metriclist;
	    	scope.state = false;
	    };

	    /**
	     * Gets Dashboard filters
	     * @param  {[type]} argument [description]
	     * @return {[type]}          [description]
	     */
	    $rootScope.GlobalFilters = {};
    	$rootScope.globalQuery = {};
	    scope.getFilters = function () {
	    	scope.showfilters = !scope.showfilters;	
	    	if(scope.showfilters){
	    		scope.showmydashboards = false;
	    		scope.metriclist = false;
	    	}
	 
	    	$rootScope.myPromise = filtersFactory.getFilterData().$promise.then(function (data) {                         		            
	            // $rootScope.GlobalFilters=data.filters;
	            scope.FilterData = data.filters;	 
	            var filterKeys = Object.keys(data.filters[0]);
	            for (var i = 0; i < filterKeys.length; i++) {	            	
	            	$rootScope.GlobalFilters[filterKeys[i]] = scope.pluck(scope.FilterData, filterKeys[i], null, null);
	            };
	            if(scope.navigationIcon()){
	            	scope.updateGlobalFilters();
    			}	  	            
		        }, 
		        function (err) {
		        	messageCenterService.add('danger', 'Could Not Load Filters', {timeout: 5000});
	        });

	    }

	    /**
	     * find unique items in an array by key	     
	     * @param  {[type]} array [description]
	     * @param  {[type]} key   [description]
	     * @return {[type]}       [description]
	     */
	    scope.pluck = function(arr, key, matchKey, value) {
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
	    scope.updateFilterQuery = function (key, value) {
	         // udpate global search query
	        if($rootScope.globalQuery.hasOwnProperty(key)){

	            // if the values exists                      
	            var exists = false;
	            var index = 0;
	            for (var i = 0; i < $rootScope.globalQuery[key].length; i++) {
	                if($rootScope.globalQuery[key][i] == value){
	                    index = i;                                           
	                    exists = true;
	                    break;
	                }
	            }
	            if(!exists)
	            {	            	
	                $rootScope.globalQuery[key][$rootScope.globalQuery[key].length] = value; 	                
	            }
	            else{
	                $rootScope.globalQuery[key].splice(index, 1);
	                if($rootScope.globalQuery[key].length === 0){
	                    delete $rootScope.globalQuery[key];
	                }
	            }                                                       
	        }
	        else{                           
	            $rootScope.globalQuery[key] = [value]	            
	        }          	        
	        scope.updateGlobalFilters();
	    };

	    /**
	     * this function updates relational filter values
	     */
	    scope.updateGlobalFilters = function () {
	    	var data = scope.FilterData;
	    	var dataHolder = [];
	    	for(var queryKey in $rootScope.globalQuery){	    		
	    		var tempArr = Object.keys(data[0])
	    		tempArr.splice(tempArr.indexOf(queryKey), 1);
	    		for(var i in $rootScope.globalQuery[queryKey]){
	    			for(var j in tempArr){
	    				var result = scope.pluck(data, tempArr[j], queryKey, $rootScope.globalQuery[queryKey][i]);
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
	    		$rootScope.GlobalFilters[key] = dataHolder[key];
	    	}
	    }

	    /**
	     * this function checks whether any item is in filter query
	     * @param  {[type]} key   [description]
	     * @param  {[type]} value [description]
	     * @return {[type]}       [description]
	     */
	    scope.isInQuery = function (key, value) {
		    if($rootScope.globalQuery.hasOwnProperty(key)){
		        for (var i = 0; i < $rootScope.globalQuery[key].length; i++) {
		            if($rootScope.globalQuery[key][i] == value){
		                return true;
		            }
		        };
		    }
		    return false;
		};

	    /**
	     * this function unselects all filter values
	     * @param  {[type]} key [description]
	     * @return {[type]}     [description]
	     */
	    scope.unselectAllFilterValues = function (key) {
            delete $rootScope.globalQuery[key];
            scope.updateGlobalFilters();
	    };

		/**
		 * this function applies the selected filters.
		 * @param  {[type]} argument [description]
		 * @return {[type]}          [description]
		 */
	    scope.applyFilter = function (argument) {
	    	$rootScope.applyFilter = $rootScope.applyFilter + 1;
	    	$rootScope.placeholder.edited = true; 
	    	scope.showfilters = false; 	
	    	toggleSideBar();  

	    }


	    /**
	     * this function resets the variables
	     * @param  {[type]} argument [description]
	     * @return {[type]}          [description]
	     */
	    scope.reset = function (argument) {
	    	scope.showmydashboards = false;		
	    	scope.metriclist = false;	 
	    	scope.showfilters = false;  		    	
	    };
      }
    };
  });


