var isUUID = require('is-uuid').anyNonNil

module.exports = function UUID(v) {
  return isUUID(v)? true : Error('invalid UUID')
}
