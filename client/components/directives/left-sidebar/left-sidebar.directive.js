'use strict';

angular.module('sasaWebApp')
  .directive('leftSidebar', function ($window,$rootScope, filtersFactory, messageCenterService, $stateParams, workflow, parentService, usersFactory,$http,$mdDialog) {
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

	    //This function gets a list of metrics and their workflows
	    scope.getMetrics=function () {
	    	var idsid = $rootScope.user;
	    	scope.metriclist = !scope.metriclist;	    	
	    	if(scope.metriclist){
	    		scope.showmydashboards = false;
	    		scope.showfilters = false;
	    	}
       // $http.get('app/data/workflow.json').success(function (data){
       //        scope.dashboardList = data;  


       //     }); 
	    	workflow.get({idsid:idsid}).$promise.then(function (data) {
	    		scope.dashboardList = data;
	    	},function (err) {
	    		messageCenterService.add('danger', 'Could Not Load Metrics', {timeout: 5000});	    		
	    	});
	    };
        
        scope.openEamModal=function(metricName,url){
        	var items={
        		metricName:metricName,
        		url:url
        	};
           $mdDialog.show({
    		      controller: 'eamLinkController',
                  clickOutsideToClose: false,
                  templateUrl: 'app/access/eamLink.html',
                  locals: {
                  item: items
                  }
                  
               });
        }; 
	    //This function adds metrics to dashboard
	    scope.addMetric2Dashboard = function (argument,metricName,url) {
	    	//Calling parent service function to add metric to dashbord
            //if item.id is undefined .it means that user doesn't have access the particular metric and open the EAM link modal.
	    	if(!angular.isUndefined(argument)){
			    	parentService.placeholderAdd('metric',argument);
			    	$rootScope.placeholder.edited = true;
			    }
			    else{
			    	 scope.openEamModal(metricName,url);
			    }
	    };

	    //This function is being used to determine whether 
	    //a metric has already been added in dashboard or not.
	    scope.show = function(item){
            var pos = $rootScope.placeholder.metric.map(function(e) { return e._id; }).indexOf(item);
            if(pos !== -1 && $rootScope.placeholder.metric[pos].name !== undefined){return true;}
            else return false;
	    }

	    /**
	     * Gets Dashboard filters
	     * @param  {[type]} argument [description]
	     * @return {[type]}          [description]
	     */
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
	            var tempkey = {
	            	"segment":"Cross Enterprise",
	            	"portfolio":"Finance",
	            	"service":"Close and Reporting",
	            	"service_component":"Close and Reporting (S)",
	            	"support_skill":"C and R Batch Jobs",
	            	"product":"AssureNet"

	            } 
	            scope.filterKeys = Object.keys(tempkey);
	           
	            for (var i = 0; i < scope.filterKeys.length; i++) {	            	
	            	$rootScope.GlobalFilters[scope.filterKeys[i]] = scope.pluck(scope.FilterData, scope.filterKeys[i], null, null);
	            
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
	    	var tmp ={};
	    	if(value && matchKey){
	    		var result = $.map(arr, function(e) { 
	    			if(e[matchKey] === value)
	    			tmp[e[key]] = e[key]
	    			return e[key]; 
	    		});
	    	} 
	    	// first time filter will load from else part
	    	else{ 
	 			var result = $.map(arr, function(e) {
						tmp[e[key]] = e[key];
						return e[key];
				});
		    }
	    		   		
		    var r = [];
		    for (var key in tmp){
		    	if(tmp.hasOwnProperty(key)){
		    		r.push(key)
		    	}
		    } 
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

	    scope.example1model = []; 
	    scope.example1data = [ {id: 1, label: "David"}, {id: 2, label: "Jhon"}, {id: 3, label: "Danny"}];

	    /**
	     * this function updates relational filter values
	     */
	    scope.updateGlobalFilters = function () {
	    	if(Object.keys($rootScope.globalQuery).length == 0){	    		
	    		scope.showfilters = !scope.showfilters;
	    		scope.getFilters();	
	    	}
	    	var data = scope.FilterData;
	    	var dataHolder = [];
	    	for(var queryKey in $rootScope.globalQuery)
	    	{	
	    		var tempArr = Object.keys(data[0])
	    		tempArr.splice(tempArr.indexOf(queryKey), 1);
	    		for(var i in $rootScope.globalQuery[queryKey])
	    		{
	    			for(var j in tempArr)
	    			{
	    				var result = scope.pluck(data, tempArr[j], queryKey, $rootScope.globalQuery[queryKey][i]);
	    				if(dataHolder[tempArr[j]]){
							dataHolder[tempArr[j]] = dataHolder[tempArr[j]].concat(result)
							//find unique values			
						    var tmp_data = {}, l = dataHolder[tempArr[j]].length, unique_values = [];
						    for(var k=0; k<l;k+=1) tmp_data[dataHolder[tempArr[j]][k]] = dataHolder[tempArr[j]][k];
						    for( var key in tmp_data) unique_values.push(tmp_data[key]);
						    dataHolder[tempArr[j]] = unique_values;
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
	    	$rootScope.$broadcast('featureWordCloud');
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

