(function () {
	'use strict';

	/**
	 * @name intcBeacon
	 * @description intcBeacon Provider for logging reusable components in use by the application.
	 */
	angular
		.module('intcBeacon', [])
		.provider('intcBeacon', intcBeaconProvider)
		.run(['intcBeacon', '$location', function (intcBeacon, $location){
			var host = $location.host();
			if (host !== '127.0.0.1' && host !== 'localhost') {
				intcBeacon.saveData();
			}
		}]);



	/**
	 * Creates the intcBeacon provider used for logging reusable components in use by the application.
	 */
	function intcBeaconProvider () {
		//****************** Variables ********************
		var components = [];
		var angularVersion = angular.version.full;
		var host = window.location.hostname;
		var url = window.location.href;





		//****************** Functions ********************
		/**
		 * Creates the intcBeacon factory used for saving the component data.
		 * @param {Object} $http Angular's $http services.
		 * @return {Object} The intcBeacon factory.
		 */
		this.$get = ['$http', function ($http) {
			return {
				saveData: function () {
					//Create the settings used by the $http service
					var settings = {
						data: {
							type: 'message',
							data: components
						},
						headers: {
							'Content-Type': 'application/json'
						},
						method: 'POST',
						url: 'https://reuse-mothership-api.apps1-fm-int.icloud.intel.com/v1/batches'
					};

					//We don't actually care whether the POST worked or not
					$http(settings);
				}
			};
		}];





		/**
		 * Adds a reusable component to the array of reusable components the application is using.
		 * @param {string} name The name of the component.
		 * @param {string} version The bower version of the component.
		 * @param {Object} data Any additional data the reusable component author wishes to include in the log.
		 */
		this.registerComponent = function (name, version, data) {
			//Validate the necessary info is included
			if (validateComponent(name, version)) {
				//It is there so create the component object to be logged
				var component = {
					environment: {
						name: 'Angular',
						version: angularVersion
					},
					host: host,
					name: name,
					url: url,
					version: version
				};

				//Add a data property if it is populated
				if (data) {
					component.data = data;
				}

				//Add it to the array
				components.push(component);
			}
		};




		/**
		 * Validates that the reusable component included the name and version parameters.
		 * @param {string} name The name of the reusable component to log.
		 * @param {string} version The bower version of the reusable component to log.
		 * @return {boolean} Indicator if the name and version were passed.
		 */
		function validateComponent (name, version) {
			//Check for name
			if (!name) {
				//Not set so throw error
				throw {
					name: 'intcBeacon Error',
					message: 'The name must be included when calling intcBeaconProvider.registerComponent'
				};
			}

			//Check for version
			if (!version) {
				//Not set so throw error
				throw {
					name: 'intcBeacon Error',
					message: 'The version must be included when calling intcBeaconProvider.registerComponent'
				};
			}

			//If it got this far, name and version are included
			return true;
		}
	}




})();