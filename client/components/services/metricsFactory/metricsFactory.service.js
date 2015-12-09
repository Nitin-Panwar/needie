'use strict';

angular.module('sasaWebApp')
  .factory('metricsFactory', function ($resource,webServiceURL) {
    var url = webServiceURL.url;
    var config = webServiceURL.config;

    return $resource(url + '/getmetrics', {}, {
      show: {
        method:'GET',
        headers: config,
        responseType: 'json',
        param: {
        }
      },
      filterShow: {
        method:'POST',
        headers: config,
        responseType: 'json',
        param: {
          metricId:{},
          filters:{}
        }
      }
  });
});
