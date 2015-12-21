'use strict';

describe('Controller: DashboardSaveCtrl', function () {

  // load the controller's module
  beforeEach(module('sasaWebApp'));

  var DashboardSaveCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DashboardSaveCtrl = $controller('DashboardSaveCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
