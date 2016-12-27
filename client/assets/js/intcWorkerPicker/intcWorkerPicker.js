/**
 * This is the main intcWorkerPicker directive.  It uses the intcPicker factory to set the Angular-ui typeahead
 * attributes and removes itself from the input element.  It then re-compiles the input element so the typeahead
 * directive will be loaded. It uses a very high priority so that it is run first and then it uses terminal to
 * stop any further automatic compiling (since it will manually compile the element).
 * @param {object} scope The scope passed to the directive.
 * @param {object} element The jqLite wrapper of the element referencing the directive.
 * @param {object} attrs The HTML attributes of the element.
 */
angular.module('intcWorkerPicker', ['intcPicker', 'intcBeacon'])
  .config(function(intcBeaconProvider){
    intcBeaconProvider.registerComponent('intc-worker-picker', '2.0.1');
  })
  .directive('intcWorkerPicker', ['$templateCache', 'intcPicker', function intcWorkerPicker ($templateCache, intcPicker) {
    return {
      priority: 1000,
      restrict: 'A',
      terminal: true,
      link: function intcWorkerPickerLink (scope, element, attrs) {
        /**
         * Runs when the directive is first loaded.  Will set up the configuration properties and call the
         * factory to create the typeahead.
         */
        var activate = function () {
          //Get the config object
          var pickerConfig = intcPicker.getObject(scope, attrs.intcWorkerPicker);

          //Validate the picker object exists
          intcPicker.validatePicker(pickerConfig);

          //Set default properties
          setWorkerConfig(pickerConfig, attrs.placeholder);

          //Create the typeahead
          intcPicker.createTypeAhead (scope, element, attrs, pickerConfig, 'intc-worker-picker');
        };




        /**
         * Dynamically builds the worker display template for the typeahead directive based on config settings.
         * @param {object} pickerConfig The picker config object.
         */
        function createTemplate (pickerConfig) {
          //Array of strings that will become the template
          var template = [];

          //Default to no additional row class
          var rowClass = '';

          //Check if the display will be multiline
          if (pickerConfig.display.multiline) {
            //Yes so add the additional row class to force padding on the left
            rowClass = ' iwp-row-photo';
          }

          //Add the overall container element - adding logic to highlight the active row since the typeahead has an issue doing this when
          //using the arrow keys and a custom template
          template.push('<div class="iwp-row' + rowClass + '" data-ng-class="{\'iwp-row-active\':$parent.isActive($parent.$index)}">');

          //Check if the photo will be displayed
          if (pickerConfig.display.photo) {
            //Yes so add the image tag
            template.push('<img data-intc-photo-error class="iwp-photo" data-ng-src="http://photos.intel.com/images/{{match.model._source.WWID}}.jpg" alt="{{match.model._source.FullNm}}">');
          }

          //Create the block container for the first row
          template.push('<div>');

          //Add the worker's name
          template.push('<span class="iwp-name" data-ng-bind="match.model._source.FullNm"></span>');

          //Check if the display is mulitline
          if (pickerConfig.display.multiline){
            //Yes so add the second row
            template.push('</div>');
            template.push('<div class="iwp-second-row">');
          }

          //Use this to indicate if a field is being displayed that will require a ' - ' after it
          var dashNeeded;

          //Add the worker's WWID
          if (pickerConfig.display.wwid) {
            dashNeeded = true;
            if(!pickerConfig.display.multiline){
              template.push(' - ');
            }
            template.push('<span data-ng-bind="match.model._source.WWID"></span>');
          }

          //Add the worker's IDSID
          if (pickerConfig.display.idsid) {
            if (dashNeeded) {
              template.push(' - ');
            }
            dashNeeded = true;
            template.push('<span data-ng-bind="match.model._source.Idsid"></span>');
          }

          //Add the worker's location
          if (pickerConfig.display.location) {
            if (dashNeeded) {
              template.push(' - ');
            }
            template.push('<span data-ng-bind="match.model._source.WorkLocationTxt"></span>');
          }

          //Close the row
          template.push('</div>');

          //Close the container
          template.push('</div>');

          //Return the concatenated template string
          return template.join('');
        }





        /**
         * Sets the default config settings for the intcWorkerPicker. These settings will be used by the intcWorkerPicker as well
         * as the intcPicker factory to generate the typeahead.
         * @param {object} pickerConfig The picker config object.
         * @param {string} placeholder The placholder attribute of the input element.
         */
        var setWorkerConfig = function (pickerConfig, placeholder) {
          //If there is not a display object, create one
          if (!pickerConfig.display) {
            pickerConfig.display = {};
          }

          //If displaying a photo, multiline is mandatory
          if (pickerConfig.display.photo) {
            pickerConfig.display.multiline = true;
          }

          //WWID is displayed by default
          if (pickerConfig.display.wwid !== false) {
            pickerConfig.display.wwid = true;
          }

          //Create the lookup function for the full service URL (used by the getFunction)
          if (!pickerConfig.getServiceUrl) {
            pickerConfig.getServiceUrl = function getServiceUrl (inputText) {
              return pickerConfig.serviceUrl + encodeURIComponent(inputText);
            };
          }

          //Add a default placeholder for the input
          if (!placeholder && !pickerConfig.placeholder) {
            pickerConfig.placeholder = 'Search for an employee by WWID, IDSID, or Name';
          }

          //Name of the object in the service that contains the search results
          if (!pickerConfig.templateName) {
            pickerConfig.templateName = '';
          }

          //Name of the object in the service that contains the search results
          if (!pickerConfig.getResultsFromResponse) {
            pickerConfig.getResultsFromResponse = function (response) {
              return response.data.hits;
            };
          }

          //Needed for the typeahead attribute
          if (pickerConfig.labelPath !== '' && !pickerConfig.labelPath) {
            pickerConfig.labelPath = '_source.FullNm';
          }

          //Check if a worker service URL was not set
          if (!pickerConfig.serviceUrl) {
            var  protocol = 'https';
            //Check protocol
            if (pickerConfig.http) {
              protocol = 'http';
            }
            pickerConfig.serviceUrl = protocol + '://5starservices.intel.com/search/api/People?q=';
          }

          //Default the template URL to the config object's setting
          var templateUrl = pickerConfig.templateUrl;

          //Check if a template URL was not set in the config object
          if (!templateUrl) {
            //Set a URL for the template we have created
            templateUrl = 'intcWorkerPickerTemplate' + pickerConfig.templateName + '.html';

            //Update the templateURL
            pickerConfig.templateUrl = templateUrl;

            if (!$templateCache.get(templateUrl)) {
              //Not set so create a template
              var newTemplate = createTemplate(pickerConfig);

              //Add the template to cache with the specified URL
              $templateCache.put(templateUrl, newTemplate);
            }
          }
        };





        /****************** Auto-Run *****************************/
        activate();
      }
    };
  }]);






//This directive is used to display a placeholder if the worker does not have their badge photo enabled.
angular.module('intcWorkerPicker').
  directive('intcPhotoError', function intcPhotoError() {
    return {
      /**
       * This directive is used to intercept 404 errors when a worker does not have their image enabled.  It replaces
       * the image element with an icon.
       * @param {object} scope The scope passed to the directive.
       * @param {object} element The jqLite wrapper of the element referencing the directive.
       * @param {object} attrs The HTML attributes of the element.
       */
      link: function intcPhotoErrorLink (scope, element, attrs) {
        /****************** Auto-Run *****************************/

        //Set the function for if there is an error loading the image
        element.on('error', function() {
          //Verify the image element still exists (the typeahead hasn't removed it yet)
          if (element) {
            try {
              //Replace the image with an icon
              element.replaceWith('<div class="iwp-photo"><i class="intelicon-user-person"></i></div>');
            } catch (ex) {
              //Ignore errors thrown here in case typeahead has already removed the element
            }
          }
        });
      }
    }
  });




