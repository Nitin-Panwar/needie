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

	    	console.info('getting user dashboards');

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
	    	scope.metriclist = !scope.metriclist;	    	
	    	if(scope.metriclist){
	    		scope.showmydashboards = false;
	    		scope.showfilters = false;
	    	}

	    	workflow.get().$promise.then(function (data) {
	    		scope.dashboardList = data;
	    	},function (err) {
	    		console.error(err);
	    	});
	    }

	    /**
	     * adds metrics to dashboard
	     * @param {[type]} argument [description]
	     */
	    scope.addMetric2Dashboard = function (argument) {
	    	parentService.placeholderAdd('metric',argument);
	    };

	    /**
	     * Gets Dashboard filters
	     * @param  {[type]} argument [description]
	     * @return {[type]}          [description]
	     */
	    $rootScope.GlobalFilters = {};
    	$rootScope.globalQuery = {};
	    scope.getFilters = function (argument) {
	    	scope.showfilters = !scope.showfilters;	    	

	    	if(scope.showfilters){
	    		scope.showmydashboards = false;
	    		scope.metriclist = false;
	    	}

	    	$rootScope.myPromise = filtersFactory.getFilterData().$promise.then(function (data) {                         	
	            $rootScope.GlobalFilters=data;	            
		        }, 
		        function (err) {
		        	messageCenterService.add('danger', 'Could Not Load Filters', {timeout: 5000});
	        });
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
	    };

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
	    };

		/**
		 * this function applies the selected filters.
		 * @param  {[type]} argument [description]
		 * @return {[type]}          [description]
		 */
	    scope.applyFilter = function (argument) {
	    	$rootScope.applyFilter = $rootScope.applyFilter + 1;
	    	console.info($rootScope.applyFilter);
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


