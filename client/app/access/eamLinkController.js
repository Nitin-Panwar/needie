
//eamlink controller for open an eam link modal screen if any secured metrics in the workflow or dashboard
angular.module('sasaWebApp').controller('eamLinkController',['$scope','$mdDialog','item',function($scope,$mdDialog,item){

  $scope.metricName=item.metricName;
  $scope.url=item.url;
       
  $scope.closeModal=function(){
      $mdDialog.hide()
  };
  $scope.cancel=function(){
   $mdDialog.hide()
  };
}]);