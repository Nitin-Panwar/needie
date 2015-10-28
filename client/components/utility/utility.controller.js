'use strict';

angular.module('sasaWebApp')
  .controller('UtilityCtrl', function ($scope, $rootScope) {
  	/**
  	 * This function is used to stop angular-busy on ESC keypress
  	 * @param  {[type]} e [description]
  	 * @return {[type]}   [description]
  	 */
    $scope.down=function(e){
      if (e.keyCode == 27){
        $rootScope.promise=null;
      }
    };

    
  });
