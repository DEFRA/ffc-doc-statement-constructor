
const db = require('../../../data')

const getActionsByCalculationReference = async (calculationId) => {
  return db.action.findAll({
    attributes: [
      ['actionId', 'actionReference'],
      ['calculationId', 'calculationReference'],
      'fundingCode',
      'groupName',
      'actionCode',
      'actionName',
      'rate',
      'landArea',
      'uom',
      'annualValue',
      'quarterlyValue',
      'overDeclarationPenalty',
      'quarterlyPaymentAmount'
    ],
    where: {
      calculationId
    },
    raw: true
  })
}

module.exports = getActionsByCalculationReference
