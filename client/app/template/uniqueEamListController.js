angular.module('sasaWebApp').controller('uniqueEamListController',['$scope','$mdDialog','item',function($scope,$mdDialog,item){
  var uniqueEamList = []
  $scope.uniqueNameUrlList=[];
  for (var i = 0; i< item.length; i++) {
   	if(item[i]['secured']==true){
   		var index=uniqueEamList.indexOf(item[i]['url']) 

   		if( index > -1){
			$scope.uniqueNameUrlList[index]['name']=$scope.uniqueNameUrlList[index]['name']+ ',  '+ item[i]['name']  			
   		}
   		else{
        	$scope.uniqueNameUrlList.push({url:item[i]['url'],name:item[i]['name']})
        	uniqueEamList.push(item[i]['url'])
     }
   	}
   }
   
  $scope.closeModal=function(){
      $mdDialog.hide()
  };
  $scope.cancel=function(){
   $mdDialog.hide()
  };
}]);