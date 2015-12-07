'use strict';

describe('Service: dashBoardsFactory', function () {

  // load the service's module
  beforeEach(module('sasaWebApp'));

  // instantiate service
  var dashBoardsFactory;
  beforeEach(inject(function (_dashBoardsFactory_) {
    dashBoardsFactory = _dashBoardsFactory_;
  }));

  it('should do something', function () {
    expect(!!dashBoardsFactory).toBe(true);
  });

});
