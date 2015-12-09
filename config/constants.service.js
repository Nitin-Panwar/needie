'use strict';

angular.module('sasaWebApp')
/**
 * constant for flask web services
 * @type {String}
*/
  .constant('webServiceURL', {
  	// web service server url
	'url': '@@url',	
	'config': { 'Content-Type': 'application/json; } charset=UTF-8' },
	'loginUrl': '@@loginUrl'
});
