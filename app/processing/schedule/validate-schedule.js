const util = require('util')
const schema = require('./schema')

const validateSchedule = (schedule) => {
  const result = schema.validate(schedule, {
    abortEarly: false
  })

  if (result.error) {
    throw new Error(`Settlement: ${util.inspect(schedule, false, null, true)} does not have the required data: ${result.error.message}`)
  }

  return result.value
}

module.exports = validateSchedule
