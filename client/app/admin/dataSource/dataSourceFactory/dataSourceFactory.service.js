'use strict';

angular.module('sasaWebApp')
  .factory('dataSourceFactory', function ($resource,webServiceURL) {
    var url = webServiceURL.url;
    var config = webServiceURL.config;

    return $resource(url + '/dataSource', {}, {
      save: {        
        method: 'POST',
        headers: config,
        responseType: 'json',
        param: {
          DataSource: {}
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
       
      testConnection: {        
        method: 'POST',
        headers: config,
        url: url + '/dataSource/testConnection',          
        param: {
          DataSource: {}          
        }
      },  
  });
});    
