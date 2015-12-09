'use strict';

angular.module('sasaWebApp')
  .factory('usersFactory',function ($resource, webServiceURL) {
    var url = webServiceURL.url;
    var config = webServiceURL.config;
    return $resource(url + '/', {}, {
      get: {
        method:'GET',
        headers: config,
        url:url+"/users",
        responseType: 'json',
        param: {          
        }
      },
      save:{
        method:'PUT',
        headers:config,
        url:url+'/users',
        responseType:'json',
        param:{
          idsid:{},
          dashboardId:{}          
        }
      },
      setHomepage: {
        method: 'PUT',
        headers: config,
        url: url + '/user/homepage',
        responseType: 'json',
        param: {
          idsid: {},
          dashboardId: {}
        }
      }
  });
});
