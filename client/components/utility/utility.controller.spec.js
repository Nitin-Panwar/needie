'use strict';

describe('Controller: UtilityCtrl', function () {

  // load the controller's module
  beforeEach(module('sasaWebApp'));

  var UtilityCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UtilityCtrl = $controller('UtilityCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
