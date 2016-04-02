var validate = require('../')
var ISO = require('../iso')
var Email = require('../email')
var UUID = require('../uuid')

module.exports = function customs(params, callback) {
  // define our assumed params
  var errors = validate(params, {
    'created': {required:true, type:ISO},
    'email':   {required:true, type:Email},
    'uuid':    {required:true, type:UUID}
  })
  if (errors) {
    callback(errors)
  }
  else {
    callback(null, 'params are ok')
  } 
}
