var validate = require('../')

function hi(params, callback) {
  var schema = {
    'name':       {required:true,  type:Object},
    'name.first': {required:true,  type:String},
    'name.last':  {required:false, type:String}
  }
  var errors = validate(params, schema)
  if (errors) {
    callback(errors)
  }
  else {
    callback(null, 'hi ' + params.first)
  }
}

// logs: null, hi brian
var goodParams = {
  name: {
    first: 'brian', 
    last: 'leroux'
  }
}
hi(goodParams, console.log)

// logs: [ [ReferenceError: missing required param name.first] ] 
var badParams = {name:{}}
hi(badParams, console.log)
