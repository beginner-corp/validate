var _ = require('lodash')

// built in types (thus all of JSON!)
var types = { 

  obj(v) {
    return _.isObject(v)? true : TypeError('not an object')
  },

  str(v) {
    return _.isString(v)? true : TypeError('not a string')
  },

  num(v) {
    return _.isNumber(v)? true : TypeError('not a number')
  },

  arr(v) {
    return _.isArray(v)? true : TypeError('not an array')
  },

  bool(v) {
    return _.isBoolean(v)? true : TypeError('not a boolean')
  }
}

//
// validate 
//
// - requires params and a schema
// - returns either an array of errors or false
//
function validate(params, schema) {

  if (!_.isObject(params)) {
    throw Error('validate(params, schema): params not an object')
  }

  if (!_.isObject(schema)) {
    throw Error('validate(params, schema): schema not an object')
  }

  // our best case scenario  
  var errors = []
  
  // walk each property key
  Object.keys(schema).forEach(function(k) {

    // lets get the prop
    var prop = schema[k]

    // test for required properties
    if (prop.required && !_.has(params, k)) {
      errors.push(ReferenceError('missing required param ' + k))
    }

    // type checker! only validating a type if params has the key
    if (prop.type && _.has(params, k)) {
      // do a bunch of work to find a possible err
      var aliases  = 'obj str num arr bool'.split(' ')
      var builtins = [Object, String, Number, Array, Boolean]
      var index    = builtins.indexOf(prop.type)
      var notfound = index === -1
      var checker  = notfound? prop.type : types[aliases[index]]
      var value    = _.property(k)(params)
      var err      = checker(value)
      // finally check the type
      if (_.isError(err)) {
        errors.push(TypeError('invalid type ' + k + ' is ' + err.message))
      }
    }

    // test for min and max
    var rangesafe = [String, Number, Array]
    // figure out min/max for custom types
    if (notfound && (prop.type.min || prop.type.max)) {
      rangesafe.push(prop.type)
    }

    // min
    if (prop.min && _.has(params, k) && rangesafe.indexOf(prop.type) > -1) {
      var value = _.property(k)(params)
      var isNumAndUnderMin = _.isNumber(value) && value < prop.min
      // number we check the value directly
      if (isNumAndUnderMin) {
        errors.push(RangeError('below min ' + k + ' is ' + value + ' (min is ' + prop.min + ')'))
      }
      // string and array both respond to length!
      var lengthUnderMin = (_.isString(value) || _.isArray(value)) && value.length < prop.min
      if (lengthUnderMin) {
        errors.push(RangeError('below min ' + k + ' is ' + value.length + '(min is ' + prop.min + ')'))
      }
      // custom min found on a valid custom type
      var isCustom = prop.type.min && !_.isError(prop.type(value)) && !prop.type.min(prop.min, value)
      if (isCustom) {
        errors.push(RangeError('below min ' + k + ' is ' + value + ' (min is ' + prop.min + ')'))
      }
    }

    // max
    if (prop.max && _.has(params, k) && rangesafe.indexOf(prop.type) > -1) {
      var value = _.property(k)(params)
      // number we check the value directly
      var isNumAndOverMax = _.isNumber(value) && value > prop.max
      if (isNumAndOverMax) {
        errors.push(RangeError('over max ' + k + ' is ' + value + ' (max is ' + prop.max + ')'))
      }
      // string and array both respond to length!
      var lengthOverMax = (_.isString(value) || _.isArray(value)) && value.length < prop.max
      if (lengthOverMax) {
        errors.push(RangeError('over max ' + k + ' is ' + value.length + '(max is ' + prop.max + ')'))
      }
      // custom min found on a valid custom type
      var isCustom = prop.type.max && !_.isError(prop.type(value)) && !prop.type.max(prop.max, value)
      if (isCustom) {
        errors.push(RangeError('over max ' + k + ' is ' + value + ' (max is ' + prop.max + ')'))
      }
    }
  })
 
  return errors.length? errors : false
///
}

module.exports = validate
