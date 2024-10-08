const db = require('../../data')

const saveD365 = async (transformedD365, transaction) => {
  try {
    await db.d365.create(transformedD365, { transaction })
  } catch (error) {
    throw new Error(`Error saving D365: ${error.message}`)
  }
}

module.exports = saveD365
