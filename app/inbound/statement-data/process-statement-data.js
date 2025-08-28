const { CALCULATION, ORGANISATION, TOTAL, DELINKED, DAX, D365 } = require('../../constants/types')
const { dataProcessingAlert } = require('../../utility/processing-alerts')
const { DATA_PROCESSING_ERROR } = require('../../constants/alerts')

const processOrganisation = require('../organisation/process-organisation')
const processCalculation = require('../calculation/process-calculation')
const processDelinked = require('../delinked/process-delinked')
const processTotal = require('../total/process-total')
const processDax = require('../dax/process-dax')
const processD365 = require('../d365/process-d365')

const processMapping = {
  [CALCULATION]: processCalculation,
  [ORGANISATION]: processOrganisation,
  [DELINKED]: processDelinked,
  [TOTAL]: processTotal,
  [DAX]: processDax,
  [D365]: processD365
}

const detailExtractors = {
  [DAX]: (dax, error) => ({
    process: 'process-dax',
    paymentReference: dax?.paymentReference,
    sbi: dax?.sbi,
    transactionDate: dax?.transactionDate || new Date(),
    calculationReference: dax?.calculationReference,
    error
  }),
  [D365]: (d365, error) => ({
    process: 'process-d365',
    paymentReference: d365?.paymentReference,
    paymentAmount: d365?.paymentAmount,
    transactionDate: d365?.transactionDate || new Date(),
    error
  }),
  [ORGANISATION]: (organisation, error) => ({
    process: 'process-organisation',
    sbi: organisation?.sbi,
    error
  })
  // Add other type extractors as we go.
}

const defaultExtractor = (statementData, error) => ({
  process: `process-${String(statementData?.type).toLowerCase()}`,
  ...statementData,
  error
})

const processStatementData = async (statementData) => {
  const processFunction = processMapping[statementData.type]
  if (processFunction) {
    try {
      await processFunction(statementData)
    } catch (error) {
      console.error(`Error processing statement data of type ${statementData.type}:`, error)

      const extractor = detailExtractors[statementData.type] || defaultExtractor
      const alertPayload = extractor(statementData, error)

      try {
        await dataProcessingAlert(alertPayload, DATA_PROCESSING_ERROR)
      } catch (alertErr) {
        console.error(`Failed to publish processing alert for type ${statementData.type}`, alertErr)
      }
      throw error
    }
  } else {
    console.warn(`Type is invalid or not supported: ${statementData.type}`)
  }
}

module.exports = processStatementData
