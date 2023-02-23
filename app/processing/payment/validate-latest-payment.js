const util = require('util')
const schema = require('./schema')

const validateLatestPayment = (latestPayment) => {
  const result = schema.validate(latestPayment, {
    abortEarly: false
  })

  if (result.error) {
    throw new Error(`Latest payment: ${util.inspect(latestPayment, false, null, true)} does not have the required data: ${result.error.message}`)
  }

  return result.value
}

module.exports = validateLatestPayment
