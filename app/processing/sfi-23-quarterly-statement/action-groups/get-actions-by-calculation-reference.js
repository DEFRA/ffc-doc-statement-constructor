const { actions } = require('../../../database')

const getActionsByCalculationReference = async (calculationId) => {
  return actions()
    .select({
      actionReference: 'actionId',
      calculationReference: 'calculationId'
    },
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
    )
    .where({ calculationId })
}

module.exports = getActionsByCalculationReference
