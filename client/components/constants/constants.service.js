'use strict';

angular.module('sasaWebApp')
/**
 * constant for flask web services
 * @type {String}
*/
  .constant('webServiceURL', {
  	// web service server url
	'url': 'http://vmssasadevapp1.gar.corp.intel.com:5050',	
	'config': { 'Content-Type': 'application/json; } charset=UTF-8' },
	'loginUrl': 'http://vmssasadevweb1.gar.corp.intel.com:8099/getUser'
});
