'use strict';

angular.module('sasaWebApp')
  .factory('barChartFactory', function ($resource,webServiceURL) {
    var url = webServiceURL.url;
    var config = webServiceURL.config;

    return $resource(url + '/barChart', {}, {
    index: {
        method: 'GET',
        headers: config,
        isArray: true,
        responseType: 'json'
      }
    });
  });