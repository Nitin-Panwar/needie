'use strict';

angular.module('sasaWebApp')
  .factory('dashBoardsFactory', function ($resource,webServiceURL) {
    var url = webServiceURL.url;
    var config = webServiceURL.config;

    return $resource(url + '/dashBoards', {}, {
      index: {
        method:'GET',
        headers: config,
        responseType: 'json',
        isArray: true,
        param: {
          idsid: {}
        }
      },
      delete:{
        method:'DELETE',
        headers:config,
        responseType:'json',
        param:{
          idsid: {},
          dashboardId:{}
        }
      },
      update:{
        method:'PUT',
        headers:config,
        responseType:'json',
        param:{
          dashBoard:{},
          idsid: {}
        }
      },
      save: {
        method:'POST',
        headers: config,
        responseType: 'json',
        param: {
          dashboard:{}
        }
      },
      show:{
        method:'POST',
        url:url+'/getDashboard',
        headers: config,
        responseType: 'json',
        param: {
          idsid: {},
          dashboardId:{},
          filters:{}
        }
      },
      getScaleInfo:{
        method:'GET',
        url:url+'/getScaleInfo',
        headers: config,
        responseType: 'json',
        isArray:true,
        param: {
        }
      },
      sendMail:{
        method:'GET',
        headers: config,
        url: 'http://vmssmmprodweb1.amr.corp.intel.com:8090/sendemail',
        responseType: 'json',
        param: {
          idsid: {},
          url: {}
        }
      },
      getDashboardNamebyIdsid:{
        method:'GET',
        headers: config,
        url:url+'/dashBoards/idsid',
        responseType: 'json',
        isArray: true,
        param: {
          idsid: {},
          owner_idsid:{}
          
        }
      }
    });
  });
