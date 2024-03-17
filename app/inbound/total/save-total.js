const db = require('../../data')

const saveTotal = async (total, transaction) => {
  try {
    const transformedTotal = {
      ...total,
      calculationId: total.calculationReference,
      claimId: total.claimReference
    }

    delete transformedTotal.calculationReference
    delete transformedTotal.claimReference

    await db.total.create(transformedTotal, { transaction })
  } catch (error) {
    throw new Error(`Error saving total with Calculation Id ${total.calculationReference}: ${error.message}`)
  }
}

module.exports = saveTotal
