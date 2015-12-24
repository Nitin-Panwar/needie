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
        }
      },
      delete:{
        method:'DELETE',
        headers:config,
        responseType:'json',
        param:{
        }
      },
      update:{
        method:'PUT',
        headers:config,
        responseType:'json',
        param:{
          dashBoard:{}
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
          dashboardId:{},
          filters:{}
        }
      },
      sendMail:{
        method:'GET',
        headers: config,
        url: url + '/sendemail',
        responseType: 'json',
        param: {
          idsid: {},
          url: {}
        }
      }
    });
  });
