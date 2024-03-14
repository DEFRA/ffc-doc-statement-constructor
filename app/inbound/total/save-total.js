const db = require('../../data')

const saveTotal = async (total, transaction) => {
  const totalCalculationIdConvert = {
    ...total,
    calculationId: total.calculationReference
  }
  return db.total.create(totalCalculationIdConvert, { transaction })
}

module.exports = saveTotal
