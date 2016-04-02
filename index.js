var isObject    = require('lodash.isobject')
var isString    = require('lodash.isstring')
var isNumber    = require('lodash.isnumber')
var isArray     = require('lodash.isarray')
var isBoolean   = require('lodash.isboolean')
var isError     = require('lodash.iserror')
var isUndefined = require('lodash.isundefined')
var isFunction  = require('lodash.isfunction')
var has         = require('lodash.has')
var property    = require('lodash.property')

// data structures
var aliases     = 'obj str num arr bool fun'.split(' ')
var builtins    = [Object, String, Number, Array, Boolean, Function]
var rangesafe   = [String, Number, Array]

// built in types (thus all of JSON!)
var types = { 

  obj: function obj(v) {
    return isObject(v)? true : TypeError('not an Object')
  },

  str: function str(v) {
    return isString(v)? true : TypeError('not a String')
  },

  num: function num(v) {
    return isNumber(v)? true : TypeError('not a Number')
  },

  arr: function arr(v) {
    return isArray(v)? true : TypeError('not an Array')
  },

  bool: function bool(v) {
    return isBoolean(v)? true : TypeError('not a Boolean')
  },

  fun: function bool(v) {
    return isFunction(v)? true : TypeError('not a Function')
  }
}

//
// validate 
//
// - requires params and a schema
// - returns either an array of errors or false
//
module.exports = function validate(params, schema, callback) {

  // spectactular fail for programmer error
  if (!isObject(params) || isFunction(params) || isArray(params)) {
    throw Error('validate(params, schema): params is not an Object')
  }

  // spectactular fail for programmer error
  if (!isObject(schema) || isFunction(schema) || isArray(params)) {
    throw Error('validate(params, schema): schema is not an Object')
  }

  // callback is optional
  if (!isUndefined(callback) && !isFunction(callback)) {
    throw Error('validate(params, schema, callback): callback is not a function')
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
        errors.push(TypeError('invalid type ' + k + ' is an ' + err.message))
      }
    }

    // add custom type to rangesafe if min or max is expected
    if (notfound && (prop.type.min || prop.type.max)) {
      rangesafe.push(prop.type)
    }

    // min
    if (prop.min && has(params, k) && rangesafe.indexOf(prop.type) > -1) {
      // Number: check the value directly
      var isNumAndUnderMin = isNumber(value) && value < prop.min
      // String & Array: both respond to length!
      var lengthUnderMin = (isString(value) || isArray(value)) && value.length < prop.min
      // Custom min found on a valid custom type
      var isCustom = prop.type.min && !isError(prop.type(value)) && !prop.type.min(prop.min, value)
      // anything goes!
      if (isNumAndUnderMin || lengthUnderMin || isCustom) {
        errors.push(RangeError(k + ' below min with value ' + value + ' (min is ' + prop.min + ')'))
      }
    }

    // max
    if (prop.max && has(params, k) && rangesafe.indexOf(prop.type) > -1) {
      // Number: check the value directly
      var isNumAndOverMax = isNumber(value) && value > prop.max
      // String & Array: both respond to length
      var lengthOverMax = (isString(value) || isArray(value)) && value.length < prop.max
      // Custom max found on a valid custom type
      var isCustom = prop.type.max && !isError(prop.type(value)) && !prop.type.max(prop.max, value)
      // anything goes
      if (isNumAndOverMax || lengthOverMax || isCustom) {
        errors.push(RangeError(k + ' over max with value ' + value + ' (max is ' + prop.max + ')'))
      }
    }
  })
 
  // share the love
  if (callback) {
    callback(errors.length? errors : null, errors.length? null : params)
  }

  // friendly return (empty arrays being truthy leads to fugly err first handling)
  return errors.length? errors : false
}
