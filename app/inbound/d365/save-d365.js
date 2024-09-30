const db = require('../../data')

const saveD365 = async (d365, transaction) => {
  try {
    const transformedD365 = {
      ...d365,
      calculationId: d365.calculationReference
    }
    delete transformedD365.calculationReference

    await db.d365.create(transformedD365, { transaction })
  } catch (error) {
    throw new Error(`Error saving D365: ${error.message}`)
  }
}

module.exports = saveD365
