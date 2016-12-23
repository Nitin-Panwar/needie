angular.module('sasaWebApp').controller('templateController',['$scope','$interval',function($scope,$interval){
    $scope.determineValue=100;

    $interval(function() {
       $scope.determineValue -= 1;
    }, 200,0, true);

}]);