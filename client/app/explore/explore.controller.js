'use strict';

angular.module('sasaWebApp')
  .controller('ExploreCtrl', function ($scope) {

    /**
     * Sample metric & classes
     * @type {Object}
     */
    $scope.workflows = [{name:'Incident Management', metric: [1,2,3,4], id:1},{name:'Problem Management', metric:[], id:2},{name:'Knowledge Management', metric:[5], id:3}]; 
    $scope.metrics = [
      {name:'Major Incident', alias: 'MI', id:1,
        children:[
          'app/service_mgmt_measurement/tempImages/totalMI.png',
          'app/service_mgmt_measurement/tempImages/MIByQtr.png'
        ],
        size: { x: 4, y: 3 },
        position: [0, 0]
      },
      {name:'Mean Time To Resolve', alias:'MTTR', id:2,
        size: { x: 2, y: 1 },
        position: [0, 0]
      },
      {name: 'Business Severity Impact', alias:'BSI', id:3},
      {name:'Business Recovery Time', id:4},
      {name:'# of Knowledge Articles', alias: 'KA', id:5}
    ];

    /**
     * provide searchable items for typeahead input     * 
     * @return {[type]} [description]
     */
    $scope.searchableItems = function () {
      var items = [];
      // Prepare metrics
      for (var i = 0; i < $scope.metrics.length; i++) {
        var name = $scope.metrics[i]['name']
        if ($scope.metrics[i]['alias']){
          name += " [" + $scope.metrics[i]['alias'] + "]"
        }
        var obj1 = {name: name, model: $scope.metrics[i], type:'metric'};        
        items.push(obj1);        
      };

      // Prepare workflows
      for (var i = 0; i < $scope.workflows.length; i++) {
        items.push({name: $scope.workflows[i]['name'], model: $scope.workflows[i], type: 'workflow'});
      };
      return items;
      //
    };

    /**
     * Space placeholder variable to show data
     * @type {Object}
     */
    $scope.placeholder = {metric: [], workflow: [], DBoard: null, separators: [], textBoxes: []};    
    $scope.textBoxes = [];
    
    /**
     * This function adds searched metric and workflow items in the placeholder
     *
     */
    $scope.placeholderAdd = function (argument) {      
      // check if pass value is of type metric and workflow
      if(argument.type != 'DBoard'){
        // if passed value already exists, skip
        if($scope.placeholder[argument.type].indexOf(argument.model) == -1){
          // Add to placeholder arrays
          $scope.placeholder[argument.type].push(argument.model);
        }  
      }
      else{
        // Assign DBoard
        $scope.placeholder['DBoard'] = argument.model;
      }
    };

    /**
     * This function removes items from placeholder
     * @param  {[type]} argument [description]
     * @return {[type]}          [description]
     */
    $scope.placeholderRemove = function (item, type) {      
      var index = $scope.placeholder[type].indexOf(item);      
      $scope.placeholder[type].splice(index, 1);
    };

    /**
     * This function takes metric ID as input and returns metric model
     * @param  {[type]} argument [description]
     * @return {[type]}          [description]
     */
    $scope.getmetricById = function (argument) {
      var metricItem = null;
      metricItem = $scope.metrics.filter(function (metric) {        
        if(metric.id == argument){          
          return metric;
        }
      });
      return metricItem[0];
    };

    /**
     * This function is used to add workflow metrics to placeholder
     * @param  {[type]} argument [description]
     * @return {[type]}          [description]
     */
    $scope.showworkflowmetric = function (argument) {
      // get metric Model
      var metric = $scope.getmetricById(argument);
      var name = metric.name;
      if(metric.alias){
        name += " [" + metric.alias + "]"
      }
      var obj = {name: name, model: metric, type:'metric'};
      $scope.placeholderAdd(obj);
    };

    /**
     * This function creates Discovery Board
     * @return {[type]} [description]
     */
    $scope.createDBoard = function (argument) {
      $scope.modal = {title: 'Distinct Values', content: 'Please Wait...'};
    };

    /**
     * This function adds separator in placeholder
     */    
    $scope.addSeparator = function () {
      var obj = {
          size: { x: 6, y: 3 },
          position: [0, 0],
          type: 'separator'
        };
      $scope.placeholder.separators.push(obj);
    };

    /**
     * This function adds text boxes in placeholder
     */    
    $scope.addTextBoxes = function () {
      var obj = {
          size: { x: 1, y: 8 },
          position: [0, 0],
          type: 'textbox',
          text: null
        };
      $scope.placeholder.textBoxes.push(obj);
    };



  });
