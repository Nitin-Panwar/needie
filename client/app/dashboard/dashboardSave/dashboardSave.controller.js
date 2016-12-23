

angular.module('sasaWebApp')
  .controller('DashboardSaveCtrl', function ($scope, data, $modalInstance, parentService,messageCenterService, $rootScope,dashBoardsFactory,$timeout) {
  	$scope.data = data;
    $scope.OldName = $rootScope.placeholder.dashboard.name;
    $scope.OldDescription = $rootScope.placeholder.dashboard.description; 
    $scope.exist = false;
    $scope.isShowintc_worker=false;
    $scope.idsid="";
    $scope.accessList=[];
    $scope.isVisibleDiv=false;
    $scope.isUserExist=false;
    $scope.dashboardType={
       lstDashboard:[
               { label: 'Public', value: '_ALL_' },
               { label: 'Private', value: '_RES_' }
              ],
        defaultDashboard:'_ALL_'      
    };
    if(data.view_restriction !== undefined){
        $scope.dashboardType.defaultDashboard=data.view_restriction;
         if($scope.dashboardType.defaultDashboard === "_RES_")
            $scope.isShowintc_worker=true;
           
    }
    if(data.access_list !== undefined && data.access_list.length > 0){
       $scope.accessList=data.access_list;
       $scope.isVisibleDiv=true;
    }
   
    

    $scope.intc_worker_config={
       display: {
          idsid: true,
          wwid: true
       },
       worker:"",
       onSelect :function(item){
           $scope.intc_worker_config.worker="";  
           var idsid=item._source.Idsid;
           if($scope.accessList.indexOf(idsid) == -1) {
            $scope.isUserExist=false
               $scope.accessList.push(idsid);
         }
         else{
          $scope.isUserExist=true
         }
           if($scope.accessList.length > 0){
              $scope.isVisibleDiv=true;
           }

         
       }
    };
   
    $scope.getDashboardType=function(){
           if($scope.dashboardType.defaultDashboard === "_RES_"){
            $scope.isShowintc_worker=true;
             if($scope.accessList.length > 0){
               $scope.isVisibleDiv=true;
             }  
           }
           else{
            $scope.isShowintc_worker=false;
            $scope.isVisibleDiv=false;
            $scope.accessList=[];
           }
    };
    $scope.deleteSelectedItem=function(item){
      var index = $scope.accessList.indexOf(item);
       $scope.accessList.splice(index, 1);  
     // $scope.accessList.push(item);
    };
    //Save dialogue
    $scope.save = function(flag){
      //create view_restriction and access list properties and add to data object 
      var idsid=$rootScope.user;
      $scope.data["view_restriction"]=$scope.dashboardType.defaultDashboard;
      $scope.data["access_list"]=$scope.accessList;
      //for creating new dashboard 
      if(flag===true){
        $scope.save_dashboard = dashBoardsFactory.index({idsid:idsid}).$promise.then(function(dashboards){ 
          //Getting dashboard list and assign it to other variable            
          $scope.dashboardList = dashboards;
          for(var i=0;i<$scope.dashboardList.length;i++){
            if(data.name===$scope.dashboardList[i].name){
              messageCenterService.add('danger','Dashboard exists with same name.Please try different name.',{timeout: 10000});
              $scope.exist = true;
              $scope.dashboardUrl = $scope.dashboardList[i]['_id']['$oid']
              return;
            }
          }
          // Remove dashboard id for creating new dashboard
          delete $rootScope.placeholder.dashboard._id;
         $modalInstance.close(data);
        });
      }
      //For overwriting existing dashboard
      else{
        $scope.save_dashboard = dashBoardsFactory.index({idsid:idsid}).$promise.then(function(dashboards){            
          $scope.dashboardList = dashboards;
          for(var i=0;i<$scope.dashboardList.length;i++){
            if(data.name===$scope.dashboardList[i].name){
              if($scope.OldName === data.name && $rootScope.placeholder.dashboard.owner === $rootScope.user){continue;}
              messageCenterService.add('danger','Dashboard exists with same name.Please try different name.',{timeout: 10000});
              $scope.exist = true;
              $scope.dashboardUrl = $scope.dashboardList[i]['_id']['$oid']
              return;
            }
          }
          $modalInstance.close(data);
        });
      }
      // in case its a new dashboard, create a new object for dashboard
      if($scope.OldName !== data.name){}      
    };
      
    //To close the dialog
    $scope.cancel = function(){
      $rootScope.placeholder.dashboard["name"] = $scope.OldName;
      $rootScope.placeholder.dashboard["description"] =  $scope.OldDescription;
      $modalInstance.dismiss('Canceled');
    }; 
  });
