'use strict';

angular.module('sasaWebApp')
  .factory('workflow', function ($resource, webServiceURL) {
    var url = webServiceURL.url;
    var config = webServiceURL.config;
    return $resource(url + '/', {}, {
      get: {
        method:'GET',
        headers: config,
        url:url+"/workFlows",
        responseType: 'json',
        isArray: true,
        param: {          
        }
      }
    });
  });
