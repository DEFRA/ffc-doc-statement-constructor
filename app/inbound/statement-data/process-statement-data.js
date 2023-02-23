const { CALCULATION, ORGANISATION } = require('../../constants/types')

const processOrganisation = require('../organisation/process-organisation')
const processCalculation = require('../calculation/process-calculation')

const processStatementData = async (statementData) => {
  switch (statementData.type) {
    case CALCULATION:
      await processCalculation(statementData)
      break
    case ORGANISATION:
      await processOrganisation(statementData)
      break
    default:
      throw new Error(`Type is invalid: ${statementData.type}`)
  }
}

module.exports = processStatementData
