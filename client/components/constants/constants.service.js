'use strict';

angular.module('sasaWebApp')
/**
 * constant for flask web services
 * @type {String}
*/
  .constant('webServiceURL', {
  	// web service server url
	// 'url': 'http://vmssasadevapp1.gar.corp.intel.com:5050',	
	'url': 'http://vmssmmconsapp1.amr.corp.intel.com:5000',
	'config': { 'Content-Type': 'application/json; } charset=UTF-8' },
	'loginUrl': 'http://vmsenggds.gar.corp.intel.com/getUserDetails'
});
