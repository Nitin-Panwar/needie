'use strict';

angular.module('sasaWebApp')
/**
 * constant for flask web services
 * @type {String}
*/
  .constant('webServiceURL', {
  	// web service server url
	'url': 'http://localhost:5050',	
	'config': { 'Content-Type': 'application/json; } charset=UTF-8' },
	'loginUrl': 'http://vmsenggds.gar.corp.intel.com/getUserDetails'
});
