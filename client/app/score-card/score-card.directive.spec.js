'use strict';

describe('Directive: scoreCard', function () {

  // load the directive's module and view
  beforeEach(module('sasaWebApp'));
  beforeEach(module('app/score-card/score-card.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<score-card></score-card>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the scoreCard directive');
  }));
});