const db = require('../../data')

const saveDelinked = async (delinkedCalculation, transaction) => {
  try {
    const transformedDelinked = {
      ...delinkedCalculation,
      calculationId: delinkedCalculation.calculationReference,
      applicationId: delinkedCalculation.applicationReference
    }

    delete transformedDelinked.calculationReference
    delete transformedDelinked.applicationReference

    await db.delinkedCalculation.create(transformedDelinked, { transaction })
  } catch (error) {
    throw new Error(`Error saving total with Calculation Id ${delinkedCalculation.calculationReference}: ${error.message}`)
  }
}

module.exports = saveDelinked
