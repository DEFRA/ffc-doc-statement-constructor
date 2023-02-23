const util = require('util')
const schema = require('./schema')

const validateSettlement = (settlement) => {
  const result = schema.validate(settlement, {
    abortEarly: false
  })

  if (result.error) {
    throw new Error(`Settlement: ${util.inspect(settlement, false, null, true)} does not have the required data: ${result.error.message}`)
  }

  return result.value
}

module.exports = validateSettlement
