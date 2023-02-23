const db = require('../../data')

const getFundingsByCalculationId = async (calculationId, transaction) => {
  return db.funding.findAll({
    transaction,
    attributes: [
      'calculationId',
      'areaClaimed',
      'fundingCode',
      'rate'
    ],
    include: [{
      model: db.fundingOption,
      as: 'fundingOptions',
      attributes: ['name']
    }],
    where: {
      calculationId
    },
    raw: true,
    nest: true
  })
}

module.exports = getFundingsByCalculationId
