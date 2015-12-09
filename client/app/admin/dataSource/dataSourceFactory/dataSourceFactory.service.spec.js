'use strict';

describe('Service: dataSourceFactory', function () {

  // load the service's module
  beforeEach(module('sasaWebApp'));

  // instantiate service
  var dataSourceFactory;
  beforeEach(inject(function (_dataSourceFactory_) {
    dataSourceFactory = _dataSourceFactory_;
  }));

  it('should do something', function () {
    expect(!!dataSourceFactory).toBe(true);
  });

});
