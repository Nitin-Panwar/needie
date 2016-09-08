(function () {
  'use strict';

  angular.module('intcAnalytics', [])
    .run(setupAnalytics)
    .provider('intcAnalytics', intcAnalytics);

  setupAnalytics.$inject = ['$rootScope', 'intcAnalytics'];

  function setupAnalytics($rootScope, intcAnalytics) {
    //on first run:
    // 1. create google analytics
    // 2. Hit SaUsage and Google Analytics
    intcAnalytics.setupVariablesBasedOnConfig();
    intcAnalytics.createAndHitGoogleAnayltics();
    intcAnalytics.hitSaUsage();

    $rootScope.$on('$routeChangeSuccess', function () {
      intcAnalytics.pageView();
    });
  }

  function intcAnalytics() {
    var settings = {
      debugging: false,
      localhostMode: false,
      saUsage: {
        //appId: some number,
        url: '//appusage.intel.com/Service/api/LogUser'
        //env: '' //not required- but good if you have it.
      },
      googleAnalytics: {
        //id: 'UA-XXXXXXX-X',
        //url: '//www.google-analytics.com/analytics.js'
      }
    };
    var injects = {};
    $get.$injects = ['$http', '$location'];

    return {
      $get: $get,
      setGoogleAnalyticsId: setGoogleAnalyticsId,
      setAppId: setAppId,
      setLocalhostMode: setLocalhostMode,
      setSaUsageEnviroment: setSaUsageEnviroment,
      setDebugging: setDebugging,
      setConfigurator: setConfigurator,
      setConfig: setConfigurator,        //same thing as above, but a cooler name.
      sendEvent: sendEvent
    };

    function $get($http, $location) {
      injects.$http = $http;
      injects.$location = $location;
      return {
        setupVariablesBasedOnConfig: setupVariablesBasedOnConfig,
        createAndHitGoogleAnayltics: createAndHitGoogleAnayltics,
        hitSaUsage: hitSaUsage,
        pageView: pageView,
        sendEvent: sendEvent
      };
    }

    function setupVariablesBasedOnConfig() {
      //setup configurator settings (if defined)
      if (settings.configurator && settings.configurator.config) {
        log('Configurator is set up. Setting values based on it.');
        if (settings.configurator.config.appId) {
          log('\tsetting app id to: ' + settings.configurator.config.appId);
          setAppId(settings.configurator.config.appId);
        }
        if (settings.configurator.config.googleAnalyticsId) {
          log('\tsetting google anayltics id to: ' + settings.configurator.config.googleAnalyticsId);
          setGoogleAnalyticsId(settings.configurator.config.googleAnalyticsId);
        }
        if (settings.configurator.config.localhostMode) {
          setLocalhostMode(settings.configurator.config.localhostMode);
        }
      }
    }

    function createAndHitGoogleAnayltics() {
      if (settings.googleAnalytics.id) {

        /*Code snippet from google developer website.**************************************/
        (function(i, s, o, g, r, a, m) {
          i['GoogleAnalyticsObject'] = r;
          i[r] = i[r] || function() {
              (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date();
          a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
          a.async = 1;
          a.src = g;
          m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
        /*end Code snippet from google developer website*********************************************/

        log('GA creation: ' + settings.googleAnalytics.id);
        // 'auto' will log localhost traffic
        // details: https://developers.google.com/analytics/devguides/collection/analyticsjs/cookies-user-id
        if (settings.localhostMode === true) {
          log('\tLocalhost mode is enabled, so views will be sent to GA');
          ga('create', settings.googleAnalytics.id, 'auto');
        } else {
          log('\tLocalhost mode is disabled, so views will NOT be sent to GA');
          // delete GA cookie (this is necessary after localhostMode has been set to true, then switched to false)
          document.cookie = '_ga=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          ga('create', settings.googleAnalytics.id);
        }

      }
    }

    function hitSaUsage() {
      if (settings.saUsage.appId) {
        log('SaUsage Hit: ' + settings.saUsage.url + '/' + settings.saUsage.appId + (settings.saUsage.env ? '?environment=' + settings.saUsage.env : ''));
        return injects.$http.jsonp(settings.saUsage.url + '/' + settings.saUsage.appId + (settings.saUsage.env ? '?environment=' + settings.saUsage.env : ''), {withCredentials: true});
      }
    }

    function pageView() {
      if (settings.googleAnalytics.id) {
        log('Page Hit: ' + injects.$location.path());
        ga('send', 'pageview', injects.$location.path());
      }
    }

    function sendEvent(category, action, label, value) {
      if (settings.googleAnalytics.id) {
        log('Send Event: ' + category + ' ' + action + ' ' + label + ' ' + value);
        ga('send', 'event', category, action, label, value);
      }
    }

    ////////SETTERS

    function setGoogleAnalyticsId(id) {
      settings.googleAnalytics.id = id;
    }

    function setAppId(id) {
      settings.saUsage.appId = id;
    }

    function setConfigurator(config) {
      settings.configurator = config;
    }

    function setDebugging(isDebug) {
      settings.debugging = isDebug;
    }

    function setLocalhostMode(isEnabled) {
        settings.localhostMode = isEnabled;
    }

    function setSaUsageEnviroment(env) {
      settings.saUsage.env = env;
    }

    /////////LOGGER

    function log(msg) {
      if (settings.debugging) {
        console.log(msg);
      }
    }


  }
})();
