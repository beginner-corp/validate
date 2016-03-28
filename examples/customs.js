var validate = require('../')

/**
 * custom types are functions that accept a value and
 * return either an Error or true 
 */
function ISO(v) {
  var exp = new RegExp(/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/)
  return exp.test(v)? true : Error('not an ISO date string')
}

function Email(v) {
  var exp = new RegExp(/.+\@.+\..+/)
  return exp.test(v)? true : Error('not a valid email address')
}


module.exports = function customs(params, callback) {
  // define our assumed params
  var errors = validate(params, {
    'created': {required:true, type:ISO},
    'email':   {required:true, type:Email}
  })
  if (errors) {
    callback(errors)
  }
  else {
    callback(null, 'params are ok')
  } 
}
