const { ORGANISATION, TOTAL, DELINKED, DAX, D365 } = require('../../constants/types')
const { dataProcessingAlert } = require('ffc-alerting-utils')
const { DATA_PROCESSING_ERROR } = require('../../constants/alerts')

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

const extractOrganisation = (organisation, error) => ({
  process: 'process-organisation',
  sbi: organisation?.sbi,
  error
})

const extractDelinked = (delinked, error) => ({
  process: 'process-delinked',
  sbi: delinked?.sbi,
  calculationId: delinked?.calculationId,
  calculationReference: delinked?.calculationReference,
  applicationId: delinked?.applicationId,
  error
})

const extractTotal = (total, error) => ({
  process: 'process-total',
  sbi: total?.sbi,
  agreementNumber: total?.agreementNumber,
  claimReference: total?.claimReference,
  error
})

const extractDax = (dax, error) => ({
  process: 'process-dax',
  paymentReference: dax?.paymentReference,
  sbi: dax?.sbi,
  transactionDate: dax?.transactionDate || new Date(),
  calculationReference: dax?.calculationReference,
  error
})

const extractD365 = (d365, error) => ({
  process: 'process-d365',
  paymentReference: d365?.paymentReference,
  paymentAmount: d365?.paymentAmount,
  transactionDate: d365?.transactionDate || new Date(),
  error
})

const detailExtractors = {
  [ORGANISATION]: extractOrganisation,
  [DELINKED]: extractDelinked,
  [TOTAL]: extractTotal,
  [DAX]: extractDax,
  [D365]: extractD365
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
module.exports.detailExtractors = detailExtractors
