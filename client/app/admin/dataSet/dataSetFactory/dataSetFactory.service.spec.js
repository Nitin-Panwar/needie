'use strict';

describe('Service: dataSetFactory', function () {

  // load the service's module
  beforeEach(module('sasaWebApp'));

  // instantiate service
  var dataSetFactory;
  beforeEach(inject(function (_dataSetFactory_) {
    dataSetFactory = _dataSetFactory_;
  }));

  it('should do something', function () {
    expect(!!dataSetFactory).toBe(true);
  });

});
