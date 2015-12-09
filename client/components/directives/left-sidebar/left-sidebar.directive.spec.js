'use strict';

describe('Directive: leftSidebar', function () {

  // load the directive's module and view
  beforeEach(module('sasaWebApp'));
  beforeEach(module('components/left-sidebar/left-sidebar.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<left-sidebar></left-sidebar>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the leftSidebar directive');
  }));
});