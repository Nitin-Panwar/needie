'use strict';

describe('Controller: DataSetCtrl', function () {

  // load the controller's module
  beforeEach(module('sasaWebApp'));

  var DataSetCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DataSetCtrl = $controller('DataSetCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
