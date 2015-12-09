'use strict';

describe('Service: metricsFactory', function () {

  // load the service's module
  beforeEach(module('sasaWebApp'));

  // instantiate service
  var metricsFactory;
  beforeEach(inject(function (_metricsFactory_) {
    metricsFactory = _metricsFactory_;
  }));

  it('should do something', function () {
    expect(!!metricsFactory).toBe(true);
  });

});
