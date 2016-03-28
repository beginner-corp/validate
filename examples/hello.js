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
hi({name:{first:'brian', last:'leroux'}}, console.log)

// logs: [ [ReferenceError: missing required param name.first] ] 
hi({name:{}}, console.log)
