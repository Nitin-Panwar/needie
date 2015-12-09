'use strict';

describe('Service: lineChartFactory', function () {

  // load the service's module
  beforeEach(module('sasaWebApp'));

  // instantiate service
  var lineChartFactory;
  beforeEach(inject(function (_lineChartFactory_) {
    lineChartFactory = _lineChartFactory_;
  }));

  it('should do something', function () {
    expect(!!lineChartFactory).toBe(true);
  });

});
