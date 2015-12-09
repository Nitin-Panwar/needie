'use strict';

describe('Directive: metricCard', function () {

  // load the directive's module and view
  beforeEach(module('sasaWebApp'));
  beforeEach(module('components/directives/metric-card/metric-card.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<metric-card></metric-card>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the metricCard directive');
  }));
});