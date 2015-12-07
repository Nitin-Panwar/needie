'use strict';

angular.module('sasaWebApp')
  .factory('exploreFactory', function ($resource,webServiceURL) {
    var url = webServiceURL.url;
    var config = webServiceURL.config;

    return $resource(url + '/metrics', {}, {
    index: {
        method: 'GET',
        headers: config,
        isArray: true,
        responseType: 'json'
      }
    });
  });
