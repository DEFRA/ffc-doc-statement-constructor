const { actions } = require('../../data')

const saveAction = async (records, transaction) => {
  if (!records || records.length === 0) {
    return
  }

  const transformedActions = records.map(action => ({
    actionId: action.actionReference,
    calculationId: action.calculationReference,
    fundingCode: action.fundingCode,
    groupName: action.groupName,
    actionCode: action.actionCode,
    actionName: action.actionName,
    rate: action.rate,
    landArea: action.landArea,
    uom: action.uom,
    annualValue: action.annualValue,
    quarterlyValue: action.quarterlyValue,
    overDeclarationPenalty: action.overDeclarationPenalty,
    quarterlyPaymentAmount: action.quarterlyPaymentAmount
  }))

  await actions(transaction).insert(transformedActions)
}

module.exports = saveAction
