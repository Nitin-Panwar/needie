'use strict';

angular.module('sasaWebApp')
  .factory('lineChartFactory', function ($resource,webServiceURL) {
    var url = webServiceURL.url;
    var config = webServiceURL.config;

    return $resource(url + '/lineChart', {}, {
    index: {
        method: 'GET',
        headers: config,
        isArray: true,
        responseType: 'json'
      }
    });
  });
