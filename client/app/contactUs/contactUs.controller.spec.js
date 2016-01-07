'use strict';

describe('Controller: ContactUsCtrl', function () {

  // load the controller's module
  beforeEach(module('sasaWebApp'));

  var ContactUsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ContactUsCtrl = $controller('ContactUsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
