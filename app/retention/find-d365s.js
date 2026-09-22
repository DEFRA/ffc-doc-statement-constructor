const { d365 } = require('../database')

const findD365s = async (calculationIds, transaction) => {
  return d365(transaction)
    .select('paymentReference')
    .whereIn('calculationId', calculationIds)
}

module.exports = {
  findD365s
}
