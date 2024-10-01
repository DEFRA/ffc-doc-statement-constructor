const db = require('../../data')

const saveD365 = async (d365, transaction) => {
  try {
    console.log('Transformed D365:', d365)
    await db.d365.create(d365, { transaction })
  } catch (error) {
    throw new Error(`Error saving D365: ${error.message}`)
  }
}

module.exports = saveD365
