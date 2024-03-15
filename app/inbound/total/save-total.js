const db = require('../../data')

const saveTotal = async (total, transaction) => {
  try {
    const totalCalculationIdConvert = {
      ...total,
      calculationId: total.calculationReference,
      claimId: total.claimReference
    }
    const totalClaimReferenceIdConvert = {
      ...total,
      calculationId: total.calculationReference,
      claimId: total.claimReference
    }

    const returnTotal = {
      ...total,
      calculationId: total.calculationReference,
      claimId: total.claimReference
    }

    delete returnTotal.calculationReference
    delete returnTotal.claimReference

    await db.total.upsert(totalCalculationIdConvert, totalClaimReferenceIdConvert, { transaction })
    return returnTotal
  } catch (error) {
    throw new Error(`Error saving total: ${error.message}`)
  }
}

module.exports = saveTotal
