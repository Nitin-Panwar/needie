'use strict';

angular.module('sasaWebApp')
  .controller('HelpCtrl', function ($scope,$location,$anchorScroll) {
    $scope.message = 'Hello';
    /*
      Task id:TA17144 of user story (US15436)
      Desc:'Go to Top' link is disabled once the user clicks on it for the second time 
      
    */
    $scope.scrollTo = function(id) {
      $location.hash(id);
      $anchorScroll();
   }
  });
