const db = require('../../data')

const saveDax = async (dax, transaction) => {
  try {
    const transformedDax = {
      ...dax,
      calculationId: dax.calculationReference
    }
    delete transformedDax.calculationReference

    await db.dax.create(transformedDax, { transaction })
  } catch (error) {
    throw new Error(`Error saving DAX: ${error.message}`)
  }
}

module.exports = saveDax
