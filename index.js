var isObject  = require('lodash.isobject')
var isString  = require('lodash.isstring')
var isNumber  = require('lodash.isnumber')
var isArray   = require('lodash.isarray')
var isBoolean = require('lodash.isboolean')
var isError   = require('lodash.iserror')
var has       = require('lodash.has')
var property  = require('lodash.property')
var aliases   = 'obj str num arr bool'.split(' ')
var builtins  = [Object, String, Number, Array, Boolean]
var rangesafe = [String, Number, Array]

// built in types (thus all of JSON!)
var types = { 

  obj: function obj(v) {
    return isObject(v)? true : TypeError('not an object')
  },

  str: function str(v) {
    return isString(v)? true : TypeError('not a string')
  },

  num: function num(v) {
    return isNumber(v)? true : TypeError('not a number')
  },

  arr: function arr(v) {
    return isArray(v)? true : TypeError('not an array')
  },

  bool: function bool(v) {
    return isBoolean(v)? true : TypeError('not a boolean')
  }
}

//
// validate 
//
// - requires params and a schema
// - returns either an array of errors or false
//
module.exports = function validate(params, schema) {

  // spectactular fail for programmer error
  if (!isObject(params)) {
    throw Error('validate(params, schema): params not an object')
  }

  // spectactular fail for programmer error
  if (!isObject(schema)) {
    throw Error('validate(params, schema): schema not an object')
  }

  // our best case scenario  
  var errors = []
  
  // walk each property key
  Object.keys(schema).forEach(function(k) {

    // lets get the prop
    var prop = schema[k]

    // test for required properties
    if (prop.required && !has(params, k)) {
      errors.push(ReferenceError('missing required param ' + k))
    }

    // type checker! only validating a type if params has the key
    if (prop.type && has(params, k)) {
      // do a bunch of work to find a possible err
      var index    = builtins.indexOf(prop.type)
      var notfound = index === -1
      var checker  = notfound? prop.type : types[aliases[index]]
      var value    = property(k)(params)
      var err      = checker(value)
      // finally check the type
      if (isError(err)) {
        errors.push(TypeError('invalid type ' + k + ' is ' + err.message))
      }
    }

    // add custom type to rangesafe if min or max is expected
    if (notfound && (prop.type.min || prop.type.max)) {
      rangesafe.push(prop.type)
    }

    // min
    if (prop.min && has(params, k) && rangesafe.indexOf(prop.type) > -1) {

      // number we check the value directly
      var isNumAndUnderMin = isNumber(value) && value < prop.min
      if (isNumAndUnderMin) {
        errors.push(RangeError('below min ' + k + ' is ' + value + ' (min is ' + prop.min + ')'))
      }

      // string and array both respond to length!
      var lengthUnderMin = (isString(value) || isArray(value)) && value.length < prop.min
      if (lengthUnderMin) {
        errors.push(RangeError('below min ' + k + ' is ' + value.length + '(min is ' + prop.min + ')'))
      }

      // custom min found on a valid custom type
      var isCustom = prop.type.min && !isError(prop.type(value)) && !prop.type.min(prop.min, value)
      if (isCustom) {
        errors.push(RangeError('below min ' + k + ' is ' + value + ' (min is ' + prop.min + ')'))
      }
    }

    // max
    if (prop.max && has(params, k) && rangesafe.indexOf(prop.type) > -1) {

      // number we check the value directly
      var isNumAndOverMax = isNumber(value) && value > prop.max
      if (isNumAndOverMax) {
        errors.push(RangeError('over max ' + k + ' is ' + value + ' (max is ' + prop.max + ')'))
      }

      // string and array both respond to length!
      var lengthOverMax = (isString(value) || isArray(value)) && value.length < prop.max
      if (lengthOverMax) {
        errors.push(RangeError('over max ' + k + ' is ' + value.length + '(max is ' + prop.max + ')'))
      }

      // custom min found on a valid custom type
      var isCustom = prop.type.max && !isError(prop.type(value)) && !prop.type.max(prop.max, value)
      if (isCustom) {
        errors.push(RangeError('over max ' + k + ' is ' + value + ' (max is ' + prop.max + ')'))
      }
    }
  })
 
  // friendly return (empty arrays being truthy leads to fugly err first handling)
  return errors.length? errors : false
}
