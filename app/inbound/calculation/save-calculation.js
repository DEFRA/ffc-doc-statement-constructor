const db = require('../../data')

const saveCalculation = async (calculation, transaction) => {
  return db.calculation.create(calculation, { transaction })
}

module.exports = saveCalculation
