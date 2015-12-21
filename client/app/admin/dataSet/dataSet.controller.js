'use strict';

angular.module('sasaWebApp')
  .controller('DataSetCtrl', function ($scope, $rootScope,dataSetFactory) {
    $scope.progress = 0;
    $scope.selectedDataSource = {};
    $scope.copyOfSelectedDataSouce ={};
    $scope.limit={};
    $scope.tablesList = [];
    $scope.selectedTables={};
    $scope.selectedColumns={};
    $scope.selectdTablesList = [];
    $scope.myInfoMatrix = [];
    $scope.selectedColumnsList = [];
    $scope.Relations = [];
    $scope.query=false;
    
    //For saving dataSet in mongo db and creating csv
    $scope.dataSetName='';
    $scope.tableRelations=[];
    $scope.wizard = {step1:true, step2:false, step3:false, step4:false};

    //Variables for pagination
    $scope.currentPage = 1;
    $scope.numPerPage = 10;
    $scope.maxSize = 10;
    $scope.begin=0; 
    
    /**
     * [function for inserting query]
     * @return {[type]} [description]
     */
    $scope.insertQuery=function()
    {
      $rootScope.promise=dataSetFactory.insertQuery({DataSource: $scope.selectedDataSource,query:$scope.insertedQuery}).$promise.then(function (data) {
        for (var key in data)
        { 
          if(key=='$promise' || key=='$resolved'){break;}
          var obj ={
            'schema_name' : '---',
            'table_name' : '---',
            'column_name' : data[key][0],
            'type' : data[key][1],
            'primary_key' : '---',
            'foreign_key' : '---'
          };
          $scope.myInfoMatrix.push(obj);
        }
        $scope.query = false;
        $scope.wizard.step4 = false;
        $scope.wizard.step5 = true;
      }, function () {
        messageCenterService.add('danger', 'insertQuery method failed', { timeout: 5000 });
        console.error('insertQuery method failed!!!');
      });

    }

    //For elastic textArea
    /**
     * [Function for elastic textArea]
     * @param  {[type]} element [description]
     * @return {[type]}         [description]
     */
    $scope.autoGrow=function(element) 
    {
      element.style.height = "5px";
      element.style.height = (element.scrollHeight)+"px";
    }

    //For getting date format
    /**
     * [Function for getting date format]
     * @return {[type]} [description]
     */
    $scope.getDateFormat=function()
    {
      $scope.date = prompt("Date Format", "DDMMYYYY");
      return $scope.date;
    }

    /**
     * [writeQuery function]
     * @return {[type]} [description]
     */
    $scope.writeQuery=function()
    {
      $scope.wizard.step3=false;
      $scope.wizard.step2=false;
      $scope.query=true;
    }

    /**
     * [test function]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    $scope.test=function(data)
    {
      $scope.selectedDataSource=data;
    }

    /**
     * [method for finding number of pages required for pagination]
     * @return {[type]} [description]
     */
    $scope.numPages = function () {
      return Math.ceil($scope.tablesList.length / $scope.numPerPage);
    };

    /**
     * [For changing the page in pagination]
     * @param  {[type]} ) {                 $scope.begin [description]
     * @return {[type]}   [description]
     */
    $scope.$watch('currentPage', function() {
      $scope.begin = (($scope.currentPage - 1) * $scope.numPerPage);
      $scope.end = $scope.begin + $scope.numPerPage;
      $scope.filteredTodos = $scope.tablesList.slice($scope.begin, $scope.end);
    });

    //For showing dataSource list  
    $rootScope.promise = dataSetFactory.index().$promise.then(function (data) {
    $scope.dataSources= data;        
    $scope.progress = 20;
    }, function () {
        messageCenterService.add('danger', 'DataSource indexing failed', { timeout: 5000 });
    });  

    /**
     * [To select input method]
     * @param  {[type]} doc [description]
     * @return {[type]}     [description]
     */
    $scope.selectInputMethod = function (doc) {    
      $scope.selectedDataSource=doc;
      $scope.wizard.step1 = false;
      $scope.wizard.step2 = true;
      $scope.progress = 40;
    };   
    
 
    /**
     * [To get table lsit]
     * @return {[type]} [description]
     */
    $scope.getTablesList = function () {     
      $scope.query=false;
      $rootScope.promise=dataSetFactory.getTablesList({DataSource: $scope.selectedDataSource}).$promise.then(function (tables) {
        $scope.LoadTablesList(tables);        
        $scope.wizard.step2 = false;
        $scope.wizard.step3 = true;
        $scope.progress = 60; 
        //Finding length of tablelist array for pagination 
        $scope.totalitems=$scope.tablesList.length;
        $scope.filteredTodos = $scope.tablesList.slice(0,10);
      }, function () {
        messageCenterService.add('danger', 'DataSource getTablesList failed', { timeout: 5000 });
        console.error('getTablesList failed!!!');
      });   
    };

    /**
     * [Getting seleected table's detail]
     * @return {[type]} [description]
     */
    $scope.getTableDetails = function () {  
      $scope.selectdTablesList=[];
      for (var key in $scope.selectedTables)
      {
        for (var keys in $scope.selectedTables[key])
        {
          if($scope.selectedTables[key][keys])
          {
            var index=parseInt(key)+parseInt(keys);
            var obj ={'schema' : $scope.tablesList[index].schema,'table' : $scope.tablesList[index].name};
            $scope.selectdTablesList.push(obj);
          }
        }

      }
      // To add selected tables in selectedatasource
      $scope.selectedDataSource.tables=$scope.selectdTablesList;
      $rootScope.promise=dataSetFactory.getTableDetails({DataSource:$scope.selectedDataSource ,Relation:$scope.selectdTablesList}).$promise.then(function (tables) { 
        $scope.show=true;
        $scope.Relations=tables.table;  
        if($scope.Relations.length==0)
        {
          $scope.show=false;
          $scope.tableText='Oops !!! No columns found.Looks like the selected table doesnot have any Primary Key';
        }
        $scope.wizard.step3 = false;
        $scope.wizard.step4 = true;
        $scope.progress = 80;
      }, function () {
        messageCenterService.add('danger', 'getTableDetails failed', { timeout: 5000 });
        console.error('getTableDetails failed!!!');
      });   
    };

    /**
     * [creating infomatrix]
     * @return {[type]} [description]
     */
     
    $scope.infoMatrix = function () {        
      for (var key in $scope.selectedColumns)
      {
        for (var k in $scope.selectedColumns[key])
        {
          if($scope.selectedColumns[key][k])
          {
            var obj ={
              'schema_name' : $scope.Relations[key].schema_name,
              'table_name' : $scope.Relations[key].table_name,
              'column_name' : $scope.Relations[key].column[k].column_name,
              'type' : $scope.Relations[key].column[k].type.split(' ',1)[0],
              'primary_key' : $scope.Relations[key].column[k].primary_key,
              'foreign_key' : $scope.Relations[key].column[k].foreign_key
                    };
            if(obj.foreign_key=='True')
            {
              obj.foreign_key= $scope.Relations[key].column[k].fk_schema_name+'.'+$scope.Relations[key].column[k].fk_table_name+'.'+$scope.Relations[key].column[k].fk_column_name;
            }
            $scope.myInfoMatrix.push(obj);
          }
        }
      }
      $scope.wizard.step5 = true;
      $scope.wizard.step4 = false;
      $scope.progress = 100;  
    };

    /**
     * [Check if an object is empty]
     * @param  {[type]}  argument [description]
     * @return {Boolean}          [description]
     */
    $scope.isEmptyObject = function (argument) {
      var length = Object.keys(argument).length;
      if (length > 0 ){        
        return false;
      }
      else
      {
        return true;
      }
    };

    /**
     * [checking if a parameter is empty]
     * @param  {[type]}  argument [description]
     * @return {Boolean}          [description]
     */
    $scope.isEmpty = function (argument) {
      if(typeof(argument) === 'object'){      
        return false;
      }
      else
      {
        return true;
      }
    };

    /**
     * [Normalizes object received from backend]
     * @param {[type]} tables [description]
     */
    $scope.LoadTablesList = function (tables) {
      // create tempFull array to build normalized array from tableList data
      for(var key in tables)
      {
        if(typeof(tables[key]) === 'object'){
          for(var i in tables[key])
          {
            if(key==='$promise')
            {  
              continue;
            }
            var obj = {'schema':key, 'name':tables[key][i]};
            $scope.tablesList.push(obj);
          }
        }        
      }     
    };

    /**
     * [To go in wizard-step 4 ]
     * @return {[type]} [description]
     */
    $scope.previousStep5 = function () {                 
      $scope.wizard.step5 = false;
      $scope.wizard.step4 = true;
      $scope.progress = 80;
      $scope.selectedColumns={};
      $scope.myInfoMatrix=[];
      };

    /**
     * [To go in wizard-step 3 ]
     * @return {[type]} [description]
     */
    $scope.previousStep4 = function () {                 
      $scope.wizard.step4 = false;
      $scope.wizard.step3 = true;
      $scope.progress = 60;
      $scope.selectedColumns={};
      $scope.myInfoMatrix=[];
      $scope.selectedTables={};
      $scope.selectdTablesList=[];
      d3.select('#grph').remove();
      }; 

    /**
     * [To go in wizard-step 2]
     * @return {[type]} [description]
     */
    $scope.previousStep3 = function () { 
      $scope.query=false;      
      $scope.wizard.step4 = false;          
      $scope.wizard.step3 = false;
      $scope.wizard.step2 = true;
      $scope.progress = 40;
      $scope.selectedTables={};
      $scope.selectdTablesList=[];
      $scope.Relations=[];
      //To remove previously selected radio button 
      $("input.ngSelectionHeader:radio").prop('checked', false);
      $scope.show=true;      
      d3.select('#grph').remove();
      };    
 
    /**
     * [To go in wizard-step 1]
     * @return {[type]} [description]
     */
    $scope.previousStep2 = function () {                 
      $scope.wizard.step2 = false;
      $scope.wizard.step1 = true;
      $scope.progress = 20;
      $scope.selectedDataSource = {};        
      }; 

    /**
     * [Saving Infomatrix]
     * @return {[type]} [description]
     */
    $scope.saveInfoMatrix = function () {
      $scope.dataSetName = prompt("Save As", "DataSet");
      $rootScope.promise=dataSetFactory.saveInfoMatrix({DataSet: $scope.myInfoMatrix,Name: $scope.dataSetName}).$promise.then(function () {
          messageCenterService.add('success', 'DataSet Saved', { timeout: 5000 });
        }, function () {
          messageCenterService.add('danger', 'DataSet Save Failed', { timeout: 5000 });
        });
    };
});

/**
 * For angular strap to show distinct values
 */
// angular.module('sasaWebApp')
// .config(function($modalProvider) {
//   angular.extend($modalProvider.defaults, {
//     html: true
//   });
// })
// .controller('ModalDemoCtrl', function($scope, $modal,dataSetFactory,messageCenterService) {
//   /**
//    * [To show distinct values]
//    * @param  {[type]} schema [description]
//    * @param  {[type]} table  [description]
//    * @param  {[type]} column [description]
//    * @return {[type]}        [description]
//    */
//   $scope.distinctValues=function (schema,table,column) {
//     //create Info type object to send it to backend
//     $scope.Info = {};
//     $scope.Info.schema=schema;
//     $scope.Info.table=table;
//     $scope.Info.column=column;
//     $scope.modal = {title: 'Distinct Values', content: 'Please Wait...'};
//       dataSetFactory.distinctValues({DataSet:$scope.Info}).$promise.then(function (doc) {
//         var values = '';
//         if(doc.length!==0)
//         {
//           values='<ul>';
//           for (var key in doc)
//           {
//             if(key==='$promise' || key==='$resolved')
//             {
//               continue;
//             }
//             values=values+'<li>'+doc[key][0]+'</li>';
//           }
//           values=values+'</ul>';
//         }
//         else
//         {
//           values='SORRY: Too Many Values';
//         }
//         $scope.modal = {title: 'Distinct Values', content: values};
//         messageCenterService.add('success', 'View distinct values', { timeout: 5000 });
//         }, function () {
//           messageCenterService.add('danger', 'View distinct values Failed', { timeout: 5000 });
//         });
//     };
// });
