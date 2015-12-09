'use strict';

describe('Service: barChartFactory', function () {

  // load the service's module
  beforeEach(module('sasaWebApp'));

  // instantiate service
  var barChartFactory;
  beforeEach(inject(function (_barChartFactory_) {
    barChartFactory = _barChartFactory_;
  }));

  it('should do something', function () {
    expect(!!barChartFactory).toBe(true);
  });

});
