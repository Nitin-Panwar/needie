'use strict';

angular.module('sasaWebApp')
  .factory('metricsFactory', function ($resource,webServiceURL) {
    var url = webServiceURL.url;
    var config = webServiceURL.config;

    return $resource(url + '/getmetrics', {}, {
      get: {
        method:'POST',
        url: url + '/getmetricsnapshot',
        headers: config,
        responseType: 'json',
        param: {
          metricId:{},
          filters:{}
        }
      },
      getByObject: {
        method:'POST',
        headers: config,
        responseType: 'json',
        param: {
          metric:{},
          filters:{}
        }
      }
  });
});
