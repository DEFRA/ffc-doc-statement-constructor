const db = require('../../data')

const saveDax = async (dax, transaction) => {
  try {
    const daxTotalCalculationIdConvert = {
      ...dax,
      calculationId: dax.calculationReference
    }
    delete dax.calculationReference

    const savedDaxReference = await db.dax.upsert(daxTotalCalculationIdConvert, { transaction })
    return savedDaxReference
  } catch (error) {
    throw new Error(`Error saving DAX: ${error.message}`)
  }
}

module.exports = saveDax
