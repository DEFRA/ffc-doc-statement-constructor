const db = require('../../data')

const saveFundings = async (fundings, calculationId, transaction) => {
  for (const funding of fundings) {
    await db.funding.create({ ...funding, calculationId }, { transaction })
  }
}

module.exports = saveFundings
