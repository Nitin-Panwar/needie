'use strict';

describe('Service: filtersFactory', function () {

  // load the service's module
  beforeEach(module('sasaWebApp'));

  // instantiate service
  var filtersFactory;
  beforeEach(inject(function (_filtersFactory_) {
    filtersFactory = _filtersFactory_;
  }));

  it('should do something', function () {
    expect(!!filtersFactory).toBe(true);
  });

});
