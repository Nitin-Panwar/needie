'use strict';

angular.module('sasaWebApp')
  .factory('filtersFactory', function ($resource,webServiceURL) {
    var url = webServiceURL.url;
    var config = webServiceURL.config;

    return $resource(url + '/smmFilterData', {}, {
      getFilterData: {
        method: 'GET',
        headers: config,
        responseType: 'json',
        param: {}
      }
  });
});
