(function () {
	'use strict';

	/**
	 * This factory is used for manipulating picker settings, creating the angular-ui typeahead, and
	 * retrieving data.
	 */
	angular.module('intcPicker', ['ui.bootstrap']).factory('intcPicker', intcPicker);

	intcPicker.$inject = ['$cacheFactory', '$compile', '$http', '$parse', '$q'];

	function intcPicker($cacheFactory, $compile, $http, $parse, $q) {
		//Set the public methods
		var factory = {
			createTypeAhead: createTypeAhead,
			getObject: getObject,
			getSearchResults: getSearchResults,
			setModel: setModel,
			validatePicker: validatePicker
		};
		return factory;


		/**
		 * Adds HTML elements that will be used to display the loading message.
		 * @param {object} scope The scope in which the directive is running.
		 * @param {object} element The jqLite wrapper of the element referencing the directive.
		 * @param {object} pickerConfig The picker config object.
		 * @param {string} pickerConfigName The name of the picker config object.
		 */
		function addLoading(scope, element, pickerConfig, pickerConfigName) {
			//Create the loading container
			var loadingList = document.createElement('ul');

			//Make it a bootstrap dropdown to match the typeahead display
			loadingList.setAttribute('class', 'dropdown-menu ipk-loading');

			//Get the name to use for the angular-ui typeahead loading attribute
			var loadingVariable = getLoadingVariable(pickerConfig, pickerConfigName);

			//Use the typeahead loading attribute to determine if the loading container should be displayed
			loadingList.setAttribute('data-ng-show', loadingVariable);

			//Create the message element
			var loadingMessage = document.createElement('li');

			//Add the loading message
			loadingMessage.textContent = pickerConfig.loadingMessage;

			//Add the message to the container
			loadingList.appendChild(loadingMessage);

			//Add the container after the input element
			element[0].parentNode.insertBefore(loadingList, element[0].nextSibling);

			//Compile the element since added an ng-show attribute
			$compile(loadingList)(scope);
		}


		/**
		 * Adds a search's input text and data results to cache.
		 * @param {array} results The results data of the search.
		 * @param {string} inputText String that was searched for by the picker.
		 * @param {object} pickerConfig The picker config object.
		 */
		function addToCache(results, inputText, pickerConfig) {
			//Get the results from cache
			var cache = $cacheFactory.get(pickerConfig.cacheName);

			//Check if the results were not found
			if (!cache) {
				//Not found so create the cache object
				cache = $cacheFactory(pickerConfig.cacheName);

				//Add the search results array
				cache.put(pickerConfig.cacheResults, []);
			}

			//Get the search results array
			var searches = cache.get(pickerConfig.cacheResults);

			//Add the current results to the cache array
			searches.unshift({
				results: results.slice(0),
				inputText: inputText
			});

			//Truncate it to specified length
			if (searches.length > pickerConfig.cacheSize) {
				searches.length = pickerConfig.cacheSize;
			}
		}


		/**
		 * This handles the generation of typeahead attributes and sets up the config object to use them.
		 * @param {object} scope The scope in which the directive is running.
		 * @param {object} element The jqLite wrapper of the element referencing the directive.
		 * @param {object} attrs The HTML attributes of the element.
		 * @param {object} pickerConfig The picker config object.
		 * @param {string} attributeName The attribute name of the directive (ex. "intc-worker-picker").
		 */
		function createTypeAhead(scope, element, attrs, pickerConfig, attributeName) {
			//Make sure the config object exists and has the required properties
			validatePicker(pickerConfig);
			validatePickerConfig(pickerConfig);

			//Get the name of the actual config object
			var pickerConfigName = attrs[attrs.$normalize(attributeName)];

			//Set default properties
			setConfigProperties(scope, attrs, pickerConfig, pickerConfigName, attributeName);

			//Add the typeahead attributes
			setTypeAhead(element, attrs, pickerConfig, pickerConfigName);

			//Remove the picker directive from the element so we don't get in a compile loop
			removePicker(element, attributeName);

			//Check if need to add the loading HTML elements
			if (pickerConfig.loadingMessage) {
				addLoading(scope, element, pickerConfig, pickerConfigName);
			}

			//Re-compile the input element
			$compile(element)(scope);

			element.removeAttr('aria-expanded');

			//Check if callback defined
			if (pickerConfig.pickerCreated) {
				pickerConfig.pickerCreated();
			}
		}


		/**
		 * Searches the cached results object to see if we already have results for the current input text.
		 * @param {string} inputText The worker's name, IDSID, or WWID that will be the search term.
		 * @param {object} pickerConfig The picker config object.
		 */
		function getCacheResults(inputText, pickerConfig) {
			//Get the results from cache
			var cache = $cacheFactory.get(pickerConfig.cacheName);

			//Check if the results were found
			if (cache) {
				//Yes so get the results array
				var searches = cache.get(pickerConfig.cacheResults);

				//Loop through the results
				for (var count = 0, length = searches.length; count < length; count++) {
					//Check if the inputText matches the result
					if (searches[count].inputText === inputText) {
						//Yes so return the result of that search
						return searches[count].results.slice(0);
					}
				}
			}
		}


		/**
		 * Gets the name to use for the angular-ui typeahead loading attrbiute.
		 * @param {object} pickerConfig The picker config object.
		 * @param {string} pickerConfigName The name of the picker config object.
		 */
		function getLoadingVariable(pickerConfig, pickerConfigName) {
			//Default to creating a property for the typeahead loading variable on the config object
			var loadingVariable = pickerConfigName + '.dataLoading';

			//Check if a typeahead loading variable was set
			if (pickerConfig.loading) {
				//Yes so use it instead
				loadingVariable = pickerConfig.loading;
			}

			return loadingVariable;
		}


		/**
		 * Drills into a parent object and its subobjects to get a property/object.
		 * @param {object} parent The initial parent object that contains the child property/object.
		 * @param {string} path The path to the child property/object.
		 */
		function getObject(parent, path) {
			if (path) {
				// config binding path can be dot notation, and deep
				// e.g., <object>.<object>....<object>
				// split the config binding path into an array
				var bindingPath = path.split('.');

				//Loop though the property chain using array reduce
				var objectFound = bindingPath.reduce(function (objectToTest, property) {
					//Check if the object exists
					if (objectToTest) {
						//Yes so return it
						return objectToTest[property];
					}
				}, parent);
			} else {
				objectFound = parent;
			}

			return objectFound;
		}


		/**
		 * Calls the default service to populate the search results.
		 * @param {string} inputText The text entered as the search term.
		 * @param {object} pickerConfig The picker's config object.
		 */
		function getSearchResults(inputText, pickerConfig) {
			var results;

			//Check if should look for results in cache
			if (pickerConfig.cacheSize > 0) {
				results = getCacheResults(inputText, pickerConfig);
			}

			//Check if the results were found in cache
			if (results) {
				//Yes so create the promise and return the results from cache
				var deferred = $q.defer();
				deferred.resolve(results);
				return deferred.promise;
			} else {
				//Results not in cache so make the http call to the service
				return $http.get(pickerConfig.getServiceUrl(inputText), {withCredentials: true}).then(function (response) {
					if (pickerConfig.getResultsFromResponse) {
						results = pickerConfig.getResultsFromResponse(response);
					} else {
						results = response.data;
					}

					//Check if need to limit the amount of hits
					if (results.length > pickerConfig.resultSize) {
						results.length = pickerConfig.resultSize;
					}

					//Check if need to add these results to cache
					if (pickerConfig.cacheSize > 0) {
						addToCache(results, inputText, pickerConfig);
					}

					//Return data to the typeahead
					return results;
				});
			}
		}


		/**
		 * Creates the select string used by the Angular-ui typeahead.
		 * @param {object} pickerConfig The picker config object.
		 */
		function getTypeaheadSelect(pickerConfig) {
			//Check if model path was set
			var modelPath = '';
			if (pickerConfig.modelPath) {
				modelPath = '.' + pickerConfig.modelPath;
			}

			//Check if label path was set
			var labelPath = '';
			if (pickerConfig.labelPath) {
				labelPath = '.' + pickerConfig.labelPath;
			}

			return 'result' + modelPath + ' as result' + labelPath + ' for result in ' + pickerConfig.getResponse + '($viewValue)';
		}


		/**
		 * Removes the picker directive attribute from the element.  This will stop a compile loop because the picker
		 * re-compiles the element in order to add the typeahead attributes.
		 * @param {object} element The jqLite wrapper of the element with the directive.
		 * @param {string} attributeName The attribute name of the directive (ex. 'intc-worker-picker').
		 */
		function removePicker(element, attributeName) {
			element.removeAttr(attributeName);
			element.removeAttr('data-' + attributeName);
		}


		/**
		 * Sets the default config properties for the pickerConfig.
		 * @param {object} scope The scope in which the directive is running.
		 * @param {object} attrs The HTML attributes of the element.
		 * @param {object} pickerConfig The picker config object.
		 * @param {string} pickerConfigName The name of the picker config object.
		 * @param {string} attributeName The attribute name of the directive (ex. 'intc-worker-picker').
		 */
		function setConfigProperties(scope, attrs, pickerConfig, pickerConfigName, attributeName) {
			//Create the names for the cacheFactory
			pickerConfig.cacheName = attributeName + 'Cache';
			pickerConfig.cacheResults = attributeName + 'Results';

			//Default to caching last ten search results
			if (pickerConfig.cacheSize !== 0) {
				pickerConfig.cacheSize = 10;
			}

			var getResponse;
			//Add a reference to the default get function if one is not specified
			if (pickerConfig.getResponse) {
				//Set the get function to the custom function on the config object
				getResponse = getObject(scope, pickerConfig.getResponse);
			} else {
				//Create a default get function
				pickerConfig.defaultGetFunction = function (inputText) {
					return getSearchResults(inputText, pickerConfig);
				};
				pickerConfig.getResponse = pickerConfigName + '.defaultGetFunction';

				//Default created so use the factory get function
				getResponse = getSearchResults;
			}

			//Create a wrapper function used to set the model to a specific result
			pickerConfig.setModel = function (inputText) {
				//Call the get function
				getResponse(inputText, pickerConfig).then(function (results) {
					//Set the model to the first result
					setModel(scope, attrs.ngModel, results);
				});
			};

			//Default loading message
			if (pickerConfig.loadingMessage !== '' && !pickerConfig.loadingMessage) {
				pickerConfig.loadingMessage = 'Loading...';
			}

			//Add a default placeholder for the input
			if (!attrs.placeholder && !pickerConfig.placeholder) {
				pickerConfig.placeholder = 'Enter search term...';
			}

			//Default to only displaying five search results
			if (!pickerConfig.resultSize) {
				pickerConfig.resultSize = 5;
			}

			//Default to searching after three characters have been entered
			if (!pickerConfig.minLength) {
				pickerConfig.minLength = 3;
			}
		}


		/**
		 * Used to set the model of the picker to a specific result.  It takes the first
		 * result (since there should only be one result when looking up a specific value).
		 * @param {object} scope The scope passed to the directive.
		 * @param {object} model The ngModel object.
		 * @param {array} results The result array returned from the service.
		 */
		function setModel(scope, model, results) {
			//Check for at least one result
			if (results[0]) {
				//Create the function that will set the model
				var $setModelValue = $parse(model).assign;

				//Set the model
				$setModelValue(scope, results[0]);
			}
		}


		/**
		 * Adds the typeahead attributes to the element.
		 * @param {object} element The jqLite wrapper of the element with the directive.
		 * @param {object} attrs The HTML attributes of the element.
		 * @param {object} pickerConfig The picker config object.
		 * @param {string} pickerConfigName The name of the picker config object.
		 */
		function setTypeAhead(element, attrs, pickerConfig, pickerConfigName) {
			//Add the base typeahead attribute
			element.attr('data-typeahead', getTypeaheadSelect(pickerConfig));

			if (pickerConfig.appendToBody) {
				element.attr('data-typeahead-append-to-body', 'true');
			}

			if (pickerConfig.editable === false) {
				element.attr('data-typeahead-editable', 'false');
			}

			if (pickerConfig.focusFirst === false) {
				element.attr('data-typeahead-focus-first', 'false');
			}

			if (pickerConfig.inputFormatter) {
				element.attr('data-typeahead-input-formatter', pickerConfigName + '.inputFormatter($model)');
			}

			//Check if will display a message while the picker is loading
			if (pickerConfig.loading || pickerConfig.loadingMessage) {
				//Get the name to use for the angular-ui typeahead loading attribute
				var loadingVariable = getLoadingVariable(pickerConfig, pickerConfigName);

				//Yes so add the typeahead attribute
				element.attr('data-typeahead-loading', loadingVariable);

				//Make sure the picker is not appended to the body - if it is appended to the body, the
				//CSS target will not work.
				if (!pickerConfig.appendToBody) {
					//Check if ng-class is not set
					if (!attrs.ngClass) {
						//ng-class not present so add the class that will hide previous results when loading
						element.attr('data-ng-class', '{"ipk-input":' + loadingVariable + '}');
					}
				}
			}

			element.attr('data-typeahead-min-length', pickerConfig.minLength);

			//Check if a call-back was specified for when a worker is selected
			if (pickerConfig.onSelect) {
				element.attr('data-typeahead-on-select', pickerConfigName + '.onSelect($item, $model, $label)');
			}

			//Add the template URL
			if (pickerConfig.templateUrl) {
				element.attr('data-typeahead-template-url', pickerConfig.templateUrl);
			}

			if (pickerConfig.waitMs) {
				element.attr('data-typeahead-wait-ms', pickerConfig.waitMs);
			}


			//Check if a placeholder needs to be added
			if (!element.attr('placeholder')) {
				element.attr('placeholder', pickerConfig.placeholder);
			}
		}


		/**
		 * Validates that the config object exists.
		 * @param {Object} pickerConfig The picker config object.
		 */
		function validatePicker(pickerConfig) {
			//Check for a config object
			if (!pickerConfig) {
				//Not set so throw error
				throw {
					name: 'intcPicker Error',
					message: 'intcPicker config object not set.'
				};
			}
		}


		/**
		 * Validates that the required config properties exist.
		 * @param {Object} pickerConfig The picker config object.
		 */
		function validatePickerConfig(pickerConfig) {
			//Check for a config object
			if (!pickerConfig.getResponse && !pickerConfig.getServiceUrl) {
				//Not set so throw error
				throw {
					name: 'intcPicker Error',
					message: 'intcPicker requires either the getResponse or getServiceUrl to be defined.'
				};
			}
		}
	}
})();