'use strict';

angular.module('sasaWebApp')
  .filter('titlecase', function () {
    return function (input) {
      input = (input === undefined || input === null) ? '' : input;
      return input.toString().toLowerCase().replace( /\b([a-z])/g, function (ch) {
      	return ch.toUpperCase();
      });
    };
  });