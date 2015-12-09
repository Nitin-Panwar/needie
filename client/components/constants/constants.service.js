'use strict';

angular.module('sasaWebApp')
/**
 * constant for flask web services
 * @type {String}
*/
  .constant('webServiceURL', {
  	// web service server url
	'url': 'http://localhost:5000',	
	'config': { 'Content-Type': 'application/json; } charset=UTF-8' },
	'loginUrl': 'http://10.223.12.51:8099/getUser'
});
