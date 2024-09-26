const { CALCULATION, ORGANISATION, TOTAL, DELINKED, DAX } = require('../../constants/types')

const processOrganisation = require('../organisation/process-organisation')
const processCalculation = require('../calculation/process-calculation')
const processDelinked = require('../delinked/process-delinked')
const processTotal = require('../total/process-total')
const processDax = require('../dax/process-dax')

const processStatementData = async (statementData) => {
  switch (statementData.type) {
    case CALCULATION:
      await processCalculation(statementData)
      break
    case ORGANISATION:
      await processOrganisation(statementData)
      break
    case DELINKED:
      await processDelinked(statementData)
      break
    case TOTAL:
      await processTotal(statementData)
      break
    case DAX:
      await processDax(statementData)
      break
    default:
      throw new Error(`Type is invalid: ${statementData.type}`)
  }
}

module.exports = processStatementData
