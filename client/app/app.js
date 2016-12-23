'use strict';

angular.module('sasaWebApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'MessageCenterModule',
  'dialogs.main',
  'ui.bootstrap',
  'gridster',
  'cgBusy',
  'ordinal',
  'ui.grid',
  'ui.grid.pinning',
  'ui.grid.resizeColumns',
  'ui.grid.exporter',
  'ui.grid.moveColumns',
  'ngTouch',
  'ngCsv',
  'xeditable',
  'ngMaterial',
  'intcAnalytics',
  'intcWorkerPicker',
  'ngIdle'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider,$provide,$mdThemingProvider,intcAnalyticsProvider,$animateProvider,KeepaliveProvider,IdleProvider) {
     $urlRouterProvider
      .otherwise('/');
    $locationProvider.html5Mode(true); 
    $httpProvider.useApplyAsync(true);  
   // $animate.enabled(false, element);
   $animateProvider.classNameFilter(/angular-animate/);

        /**
            * Angular Material dynamically generates Style tags
            * based on themes and palletes; for each ng-app.
            * Let's disable generation and <style> DOM injections. 
            */
    $provide.constant('$MD_THEME_CSS', ''); 
    intcAnalyticsProvider.setDebugging(true);                   //Optional line - for debugging
    intcAnalyticsProvider.setLocalhostMode(true);               //Optional line - for local dev testing
    intcAnalyticsProvider.setAppId(13806);
   
   
   IdleProvider.idle(1000); //by default the value in seconds //20 second idle
   IdleProvider.timeout(20);//10 second warning

  })

.config(['dialogsProvider','$translateProvider',function(dialogsProvider){
    dialogsProvider.useBackdrop(true);
    dialogsProvider.useEscClose(false);
    dialogsProvider.useCopy(false);
    dialogsProvider.setSize('la');
       
  }])//end config

// This filter will provide the range of the numbers in 
// dropdown
.filter('range', function() {
  return function(input, min, max) {
    min = parseInt(min); //Make string input int
    max = parseInt(max);
    for (var i=min; i<max; i++)
      input.push(i);
    return input;
  };
})

.run(
  function ($rootScope, $http, webServiceURL, messageCenterService,dashBoardsFactory,$location, usersFactory,$stateParams,Idle) {
         if(webServiceURL.url === "http://sminsights-api.intel.com"){
                 var dynamicScript = document.createElement('script'); 
                  dynamicScript.src = 'http://appusage.intel.com/Service/api/loguser/13806';
                  dynamicScript.async = 'false';
                  document.body.appendChild(dynamicScript);
          }
      Idle.watch();
    //Login user if not logged in
    if($rootScope.user == undefined){ 
      $rootScope.myPromise = $http.get(webServiceURL.loginUrl,{withCredentials:true}).then(function (response) {     
        $rootScope.userDetails = response.data.user;
        $rootScope.user = $rootScope.userDetails['idsid'].toLowerCase(); 
        //find user homepage    
        //$rootScope.user = 'gar\\pjenax'
        $rootScope.myPromise= usersFactory.get({user:$rootScope.user}).$promise.then(function (data) {
             // console.log("user info",data)
             // var defaultDashboardId="567c56df3e18090c546187c5"
             // if(data.homepage === ""){
             //  data.homepage=defaultDashboardId;
             //   }
              $rootScope.homepage = data.homepage;
               
            if(data.homepage && !$stateParams.dashboardId){
              var homepage = '/?dashboardId='+data.homepage;         
              $location.url(homepage)  
            }            
        }, function (){
            messageCenterService.add('danger', 'Could not load homepage', { timeout: 5000 });
        })     
      },function (err) {
          // redirect user to access denied page
          $location.url('/accessDenied')
          messageCenterService.add('danger','Could not login!!!',{ status: messageCenterService.status.permanent });
      })  
    }
    //API call to get the current scale value
    $rootScope.myPromise= dashBoardsFactory.getScaleInfo({}).$promise.then(function (data) { 
      $rootScope.scaleInfoData=data;
    },function (err) {
      messageCenterService.add('danger','Could not get scale Info!!!',{status: messageCenterService.status.permanent });
    })
  }
)
  angular.module('sasaWebApp').run(['gridsterConfig', function(gridsterConfig) {
 
    gridsterConfig.columns= 6, // the width of the grid, in columns
    gridsterConfig.pushing= true, // whether to push other items out of the way on move or resize
    gridsterConfig.floating= true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
    gridsterConfig.swapping= false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
    gridsterConfig.width= 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
    gridsterConfig.colWidth= 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
    gridsterConfig.rowHeight= 40, // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
    gridsterConfig.margins= [20, 20], // the pixel distance between each widget
    gridsterConfig.outerMargin= true, // whether margins apply to outer edges of the grid
    gridsterConfig.isMobile= true, // stacks the grid items if true
    gridsterConfig.mobileBreakPoint= 600, // if the screen is not wider that this, remove the grid layout and stack the items
    gridsterConfig.mobileModeEnabled= true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
    gridsterConfig.minColumns= 1, // the minimum columns the grid must have
    gridsterConfig.minRows= 2, // the minimum height of the grid, in rows
    gridsterConfig.maxRows= 250, 
    gridsterConfig.defaultSizeX= 1, // the default width of a gridster item, if not specifed
    gridsterConfig.defaultSizeY= 1, // the default height of a gridster item, if not specified
    gridsterConfig.minSizeX= 1, // minimum column width of an item
    gridsterConfig.maxSizeX= null, // maximum column width of an item
    gridsterConfig.minSizeY= 1, // minumum row height of an item
    gridsterConfig.maxSizeY= null, // maximum row height of an item
    gridsterConfig.resizable= {
       enabled: false,
       handles: ['n', 'e', 's', 'w'],
       start: function(event, $element, widget) {}, // optional callback fired when resize is started,
       resize: function(event, $element, widget) {}, // optional callback fired when item is resized,
       stop: function(event, $element, widget) {} // optional callback fired when item is finished resizing
    },
    gridsterConfig.draggable= {
       enabled: true, // whether dragging items is supported
       handle: '.mover-handle', // optional selector for resize handle
       start: function(event, $element, widget) {}, // optional callback fired when drag is started,
       drag: function(event, $element, widget) {}, // optional callback fired when item is moved,
       stop: function(event, $element, widget) {} // optional callback fired when item is finished dragging
    }
}]);