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
  'xeditable',
  'cgBusy'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/dashboard');

    $locationProvider.html5Mode(true);    
  })


  /**
   * Dialog controller config
   * @param  {[type]} dialogsProvider){                         dialogsProvider.useBackdrop(true);      dialogsProvider.useEscClose(true);      dialogsProvider.useCopy(false);     dialogsProvider.setSize('sm');    } [description]
   * @return {[type]}                    [description]
   */
.config(function(dialogsProvider){
      // this provider is only available in the 4.0.0+ versions of angular-dialog-service
      dialogsProvider.useBackdrop(true);
      dialogsProvider.useEscClose(true);
      dialogsProvider.useCopy(false);      
}) // end config

.run(
  function ($rootScope, $http) {
    // if($rootScope.user == 'undefined'){
    //   $http.get("http://10.223.12.51:8099/getUser",{withCredentials:true}).success(function (response) {  
    //     console.info(response);      
    //     $rootScope.user=response;        
    //   });    
    // }
    // 
    console.info($rootScope.user);
    // $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {     
    //   if ($rootScope.user == undefined) {
    //     event.preventDefault();        
    //     $http.get("http://10.223.12.51:8099/getUser",{withCredentials:true}).success(function (response) {        
    //       $rootScope.user=response;        
    //     }); 
    //   }
    // });
  }

);



  angular.module('sasaWebApp').run(['gridsterConfig', function(gridsterConfig) {
    gridsterConfig.columns= 6, // the width of the grid, in columns
    gridsterConfig.pushing= true, // whether to push other items out of the way on move or resize
    gridsterConfig.floating= true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
    gridsterConfig.swapping= true, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
    gridsterConfig.width= 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
    gridsterConfig.colWidth= 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
    gridsterConfig.rowHeight= 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
    gridsterConfig.margins= [10, 10], // the pixel distance between each widget
    gridsterConfig.outerMargin= false, // whether margins apply to outer edges of the grid
    gridsterConfig.isMobile= true, // stacks the grid items if true
    gridsterConfig.mobileBreakPoint= 600, // if the screen is not wider that this, remove the grid layout and stack the items
    gridsterConfig.mobileModeEnabled= true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
    gridsterConfig.minColumns= 1, // the minimum columns the grid must have
    gridsterConfig.minRows= 2, // the minimum height of the grid, in rows
    gridsterConfig.maxRows= 100,
    gridsterConfig.defaultSizeX= 2, // the default width of a gridster item, if not specifed
    gridsterConfig.defaultSizeY= 1, // the default height of a gridster item, if not specified
    gridsterConfig.minSizeX= 1, // minimum column width of an item
    gridsterConfig.maxSizeX= null, // maximum column width of an item
    gridsterConfig.minSizeY= 2, // minumum row height of an item
    gridsterConfig.maxSizeY= null, // maximum row height of an item
    gridsterConfig.resizable= {
       enabled: true,
       handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
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



angular.module('sasaWebApp').run(function(editableOptions, editableThemes) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
  editableThemes.bs3.inputClass = 'input-sm';
});



