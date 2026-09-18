const { delinkedCalculations } = require('../data')

const findDelinkedCalculations = async (applicationId, frn, transaction) => {
  return delinkedCalculations(transaction)
    .select('calculationId', 'sbi')
    .where({ applicationId, frn })
}

module.exports = {
  findDelinkedCalculations
}
