const { CALCULATION, ORGANISATION, TOTAL, DELINKED, DAX, D365 } = require('../../constants/types')

const processOrganisation = require('../organisation/process-organisation')
const processCalculation = require('../calculation/process-calculation')
const processDelinked = require('../delinked/process-delinked')
const processTotal = require('../total/process-total')
const processDax = require('../dax/process-dax')
const processD365 = require('../d365/process-d365')

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
    case D365:
      await processD365(statementData)
      break
    default:
      throw new Error(`Type is invalid: ${statementData.type}`)
  }
}

module.exports = processStatementData
