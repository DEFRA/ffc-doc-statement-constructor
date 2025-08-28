const { ORGANISATION, TOTAL, DELINKED, DAX, D365 } = require('../../constants/types')

const processOrganisation = require('../organisation/process-organisation')
const processDelinked = require('../delinked/process-delinked')
const processTotal = require('../total/process-total')
const processDax = require('../dax/process-dax')
const processD365 = require('../d365/process-d365')

const processMapping = {
  [ORGANISATION]: processOrganisation,
  [DELINKED]: processDelinked,
  [TOTAL]: processTotal,
  [DAX]: processDax,
  [D365]: processD365
}

const processStatementData = async (statementData) => {
  const processFunction = processMapping[statementData.type]
  if (processFunction) {
    try {
      await processFunction(statementData)
    } catch (error) {
      console.error(`Error processing statement data of type ${statementData.type}:`, error)
      throw error
    }
  } else {
    console.warn(`Type is invalid or not supported: ${statementData.type}`)
  }
}

module.exports = processStatementData
