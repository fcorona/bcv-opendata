var should = require('should');
var admin = require('../routes/admin');

describe('admin', function () {
  it('#validaHeaders() que devuelve falso cuando los encabezados estan vacios', function() {
   admin.validateHeaders([]).should.be.false;
  });
});
  
