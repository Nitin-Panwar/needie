'use strict';

describe('Service: usersFactory', function () {

  // load the service's module
  beforeEach(module('sasaWebApp'));

  // instantiate service
  var usersFactory;
  beforeEach(inject(function (_usersFactory_) {
    usersFactory = _usersFactory_;
  }));

  it('should do something', function () {
    expect(!!usersFactory).toBe(true);
  });

});
