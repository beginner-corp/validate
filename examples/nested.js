var validate = require('../')

module.exports = function nested(params, callback) {
  // define our assumed params
  var errors = validate(params, {
    'name':       {required:true, type:Object},
    'name.first': {required:true, type:String},
    'name.last':  {type:String} // last name not required! (we could be explicit about it too)
  })
  if (errors) {
    callback(errors)
  }
  else {
    callback(null, 'hello ' + params.name.first)
  } 
}

