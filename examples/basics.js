var validate = require('../')

function basics(params, callback) {
  var schema = {
    'meta':    {required:true, type:Object},
    'key':     {required:true, type:String},
    'count':   {required:true, type:Number},
    'results': {required:true, type:Array},
    'ok':      {required:true, type:Boolean}
  }
  var errors = validate(params, schema)
  if (errors) {
    callback(errors)
  }
  else {
    callback(null, 'params are ok')
  } 
}

module.exports = basics
