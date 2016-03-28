# validate-params-schema

Parameter validation for builtins and custom types. Accepts `params` and a `schema` and returns an array of errors or `false`.

### considerations

- For testing an `Object` that presumably came from a JSON payload
- Thusly, primarily concerned with JSON value types: `Object`, `String`, `Number`, `Array` and `Boolean`
- Custom types are easily supported (see `./examples`)
- Designed to test keys and nested keys
- Optionally validate `required`
- Optionally validate `min` and `max` for `String`, `Number` and `Array` builtin types (and easily implement for custom types)

### things it does not do

- serialization
- formatting
- nested subtypes (eg. the things in an array)
- localized error messages

## further justifications

There are a tonne of libraries that do things like this but also do a whole lot more. This library deliberately limits its scope: make errback style param contract validation super clean and simple. Work primarily with builtins. Easily extend. 

## usage

```javascript
var validate = require('validate-params-schema')

functon sum(params, callback) {
  // define our assumed params
  var errors = validate(params, {
    x: {required:true,  type:Number},
    y: {required:false, type:Number}
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

Check out `./examples` for more (and the tests).
