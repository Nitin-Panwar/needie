'use strict';

describe('Service: parentService', function () {

  // load the service's module
  beforeEach(module('sasaWebApp'));

  // instantiate service
  var parentService;
  beforeEach(inject(function (_parentService_) {
    parentService = _parentService_;
  }));

  it('should do something', function () {
    expect(!!parentService).toBe(true);
  });

});
