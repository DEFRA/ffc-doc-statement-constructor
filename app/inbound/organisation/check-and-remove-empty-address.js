const db = require('../../data')

const checkAndRemoveEmptyAddress = async (organisation, transaction) => {
  const noAddress = !organisation.addressLine1 && !organisation.addressLine2 && !organisation.addressLine3 && !organisation.city && !organisation.county && !organisation.postcode

  if (!noAddress) {
    return false
  }

  const existing = await db.organisation.findOne({
    where: { sbi: organisation.sbi },
    transaction
  })

  if (existing) {
    console.log(`Deleting organisation ${organisation.sbi} — no address provided`)
    await db.organisation.destroy({
      where: { sbi: organisation.sbi },
      transaction
    })
  } else {
    console.log(`Skipping save — organisation ${organisation.sbi} has no address and does not exist in DB`)
  }

  return true
}

module.exports = { checkAndRemoveEmptyAddress }
