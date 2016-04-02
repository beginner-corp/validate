var validate = require('../')
var DateRange = require('../daterange')

module.exports = function customs(params, callback) {
  // define our assumed params
  var errors = validate(params, {
    easter: {required:true, type:DateRange, min:'2016/01/01', max:'2017/01/01'}
  })
  if (errors) {
    callback(errors)
  }
  else {
    callback(null, 'params are ok')
  } 
}

