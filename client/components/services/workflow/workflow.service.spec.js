'use strict';

describe('Service: workflow', function () {

  // load the service's module
  beforeEach(module('sasaWebApp'));

  // instantiate service
  var workflow;
  beforeEach(inject(function (_workflow_) {
    workflow = _workflow_;
  }));

  it('should do something', function () {
    expect(!!workflow).toBe(true);
  });

});
