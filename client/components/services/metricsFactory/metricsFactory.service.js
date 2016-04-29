'use strict';

angular.module('sasaWebApp')
  .factory('metricsFactory', function ($resource,webServiceURL) {
    var url = webServiceURL.url;
    var config = webServiceURL.config;

    return $resource(url + '/getmetrics', {}, {
      get: {
        method:'POST',
        url: url + '/getmetric',
        headers: config,
        responseType: 'json',
        param: {
          metricId:{},
          filters:{},
          meta:{}
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
      },
      getColumns:{
        method : 'POST',
        url: url + '/metrics/columns',
        headers : config,
        responseType: 'json',
        isArray: true,
        param:{
          dataset: undefined  
        }        
      },
      getRawData: {
        method: 'POST',
        url: url + '/metrics/rawdata',
        headers: config,
        responseType: 'json',
        isArray: true,
        param:{
          fields: [],
          metricId: undefined,
          filters: {},
          offset: undefined
        }      
		},
      getFilters:{
        method: 'POST',
        url: url + '/metrics/filters',
        headers: config,
        responseType: 'json',
        isArray: true,
        param:{
          filterId : undefined
        }
      }
  });
});
