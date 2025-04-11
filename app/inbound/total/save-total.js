const db = require('../../data')

const saveTotal = async (total, transaction) => {
  const transformedTotal = {
    calculationId: total.calculationReference,
    claimId: total.claimReference,
    sbi: total.sbi
  }

  return db.total.create(transformedTotal, {
    transaction,
    raw: true
  })
}

module.exports = saveTotal
