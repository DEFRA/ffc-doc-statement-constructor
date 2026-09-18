const { organisations } = require('../../data')

const checkAndRemoveEmptyAddress = async (organisation, transaction) => {
  const logMessage = `Deleting organisation ${organisation.sbi}`
  const noAddress = !organisation.addressLine1 && !organisation.addressLine2 && !organisation.addressLine3 && !organisation.city && !organisation.county && !organisation.postcode

  if (!noAddress) {
    return false
  }

  const existing = await organisations(transaction)
    .where({ sbi: organisation.sbi })
    .first()

  if (existing) {
    console.log(`${logMessage} - no address provided`)
    await organisations(transaction)
      .where({ sbi: organisation.sbi })
      .del()
  } else {
    console.log(`${logMessage} - no address provided and does not exist in DB`)
  }

  return true
}

module.exports = { checkAndRemoveEmptyAddress }
