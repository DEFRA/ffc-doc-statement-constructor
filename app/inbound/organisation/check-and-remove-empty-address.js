const db = require('../../data')

const checkAndRemoveEmptyAddress = async (organisation, transaction) => {
  const logMessage = `Deleting organisation ${organisation.sbi}`
  const noAddress = !organisation.addressLine1 && !organisation.addressLine2 && !organisation.addressLine3 && !organisation.city && !organisation.county && !organisation.postcode

  if (!noAddress) {
    return false
  }

  const existing = await db.organisation.findOne({
    where: { sbi: organisation.sbi },
    transaction
  })

  if (existing) {
    console.log(`${logMessage} — no address provided`)
    await db.organisation.destroy({
      where: { sbi: organisation.sbi },
      transaction
    })
  } else {
    console.log(`${logMessage} - no address provided and does not exist in DB`)
  }

  return true
}

module.exports = { checkAndRemoveEmptyAddress }
