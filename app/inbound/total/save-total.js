const db = require('../../data')

const saveTotal = async (total, transaction) => {
  try {
    const totalCalculationIdConvert = {
      ...total,
      calculationId: total.calculationReference
    }
    const savedTotal = await db.total.upsert(totalCalculationIdConvert, { transaction })
    // delete total.calculationReference
    return savedTotal
  } catch (error) {
    throw new Error(`Error saving total: ${error.message}`)
  }
}

module.exports = saveTotal
