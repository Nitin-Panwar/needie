'use strict';

describe('Controller: DataSourceCtrl', function () {

  // load the controller's module
  beforeEach(module('sasaWebApp'));

  var DataSourceCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DataSourceCtrl = $controller('DataSourceCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
