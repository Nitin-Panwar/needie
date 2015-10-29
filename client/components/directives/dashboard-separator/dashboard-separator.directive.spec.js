'use strict';

describe('Directive: dashboardSeparator', function () {

  // load the directive's module and view
  beforeEach(module('sasaWebApp'));
  beforeEach(module('components/directives/dashboard-separator/dashboard-separator.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<dashboard-separator></dashboard-separator>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the dashboardSeparator directive');
  }));
});