[ ![Codeship Status for smallwins/validate](https://codeship.com/projects/e0e990b0-d826-0133-2fa3-6a1daaefbd5c/status?branch=master)](https://codeship.com/projects/143153)

# @smallwins/validate

Parameter validation for builtins and custom types. Accepts `params` and a `schema` and returns an array of `Error`s or `false`.

```javascript
var validate = require('@smallwins/validate')

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
```

### considerations

- For testing an `Object` that presumably came from a JSON payload
- Thusly, primarily concerned with JSON value types: `Object`, `String`, `Number`, `Array` and `Boolean`
- Custom types are easily supported (see `./examples`)
- Designed to test keys and nested keys
- Optionally validate `required`
- Optionally validate `min` and `max` for `String`, `Number` and `Array` builtin types (and easily implement for custom types)

### things it does not do

- Mutate things with: serialization, formatting or defaults
- Nested subtypes (eg. the things in an array)
- Localized error messages

## further justifications

There are a tonne of libraries that do things like this but also do a whole lot more. This library deliberately limits its scope: 

- Make errback style param contract validation super clean and simple
- Work primarily with builtins but easily extend
- Provide a nice API for usage (hence returning false instead of a truthy empty array for the return value of validate)

## another example usage

```javascript
var validate = require('@smallwins/validate')

functon sum(params, callback) {
  // define our assumed params
  var errors = validate(params, {
    x: {required:true, type:Number},
    y: {required:true, type:Number}
  })
  // err first!
  if (errors) {
    callback(errors)
  }
  else {
    callback(null, params.x + params.y)
  }
}
```

## api

`validate(params, schema)`

- `params` a plain `Object` that we assume came from JSON
- `schema` a plain `Object` for describing the shape of the data
- `callback` (optional) Node style errback `function(err, params) {}`

## schema keys

- `required` either `true` or `false` (or leave it out completely)
- `type` can be one of `Object`, `String`, `Number`, `Array` and `Boolean`
- `min` any `Number` (or anything allowed by a custom type)
- `max` any `Number` (or anything allowed by a custom type)

Check out the [examples](https://github.com/smallwins/validate-params-schema/tree/master/examples) for more on custom types and ranges (and the tests).
