'use strict';

describe('Service: exploreFactory', function () {

  // load the service's module
  beforeEach(module('sasaWebApp'));

  // instantiate service
  var exploreFactory;
  beforeEach(inject(function (_exploreFactory_) {
    exploreFactory = _exploreFactory_;
  }));

  it('should do something', function () {
    expect(!!exploreFactory).toBe(true);
  });

});
