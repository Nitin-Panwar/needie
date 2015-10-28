'use strict';

angular.module('sasaWebApp')
  .factory('dataSetFactory', function ($resource,webServiceURL) {
    var url = webServiceURL.url;
    var config = webServiceURL.config;

    return $resource(url + '/dataSource', {}, {
      getTablesList: {
        method: 'POST',
        headers: config,
        responseType: 'json',
        url : url+'/dataSource/getTablesList',
        param: {
          DataSource: {}
        }
      },

      getAllDataSet: {
        method: 'GET',
        headers: config,
        url : url+'/dataSet',
        isArray : 'True',
        responseType: 'json',
        param: {
        }
      },

      getTableDetails: {
        method: 'POST',
        headers: config,
        responseType: 'json',
        url : url+'/dataSource/getTableDetails',
        param: {
          DataSource: {},
          Relation :[]
          }
      },

      index: {
        method: 'GET',
        headers: config,
        responseType: 'json',
        isArray : 'True',
        url :url+'/dataSource', 
        param: {
          DataSource: {}
        }
      },

      saveInfoMatrix: {
        method: 'POST',
        headers: config,
        responseType: 'json',
        url : url+'/dataSet',
        isArray : 'True', 
        param: {
          DataSet: {},
          Name: String 
        }
      },

      getRelations: {
        method: 'POST',
        headers: config,
        responseType: 'json',
        url : url+'/dataSource/getRelation', 
        param: {
          tableList: {}, 
        }
      },

      insertQuery: {
        method: 'POST',
        headers: config,
        responseType: 'json',
        isArray:true,
        url :url+'/dataSource/insertQuery',
        param: {
          DataSource: {},
          query:{}
        }
      },

      distinctValues: {
        method: 'POST',
        headers: config,
        responseType: 'json',
        isArray : 'True',
        url : url+'/dataSet/distinctValues',
        param: {
          DataSet: {}
        }
      }
  });
});    