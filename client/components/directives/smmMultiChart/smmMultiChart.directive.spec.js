'use strict';

describe('Directive: smmMultiChart', function () {

  // load the directive's module
  beforeEach(module('sasaWebApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<smm-multi-chart></smm-multi-chart>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the smmMultiChart directive');
  }));
});