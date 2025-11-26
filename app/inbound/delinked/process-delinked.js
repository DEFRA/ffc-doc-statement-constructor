const { dataProcessingAlert } = require('ffc-alerting-utils')
const db = require('../../data')
const savePlaceholderOrganisation = require('./save-placeholder-organisation')
const getDelinkedByCalculationId = require('./get-delinked-by-calculation-id')
const saveDelinked = require('./save-delinked')
const validateDelinked = require('./validate-delinked')
const { DUPLICATE_RECORD } = require('../../constants/alerts')

const processDelinked = async (delinked) => {
  const PROCESS = 'processDelinked'
  let calcRef = delinked?.calculationReference ?? delinked?.calculationId
  let appRef = delinked?.applicationReference ?? delinked?.applicationId

  if (typeof calcRef === 'string' && /^\d+$/.test(calcRef)) calcRef = Number(calcRef)
  if (typeof appRef === 'string' && /^\d+$/.test(appRef)) appRef = Number(appRef)

  if (calcRef === undefined || calcRef === null || calcRef === '') {
    console.error('Missing calculationReference/calculationId for delinked', delinked)
    throw new Error('Missing calculationReference/calculationId')
  }

  try {
    const existingDelinked = await getDelinkedByCalculationId(calcRef)
    if (existingDelinked) {
      console.info(`Duplicate delinked received, skipping ${existingDelinked.calculationId}`)
      await dataProcessingAlert({
        process: PROCESS,
        ...delinked,
        message: `A duplicate record was received for calculation ID ${existingDelinked.calculationId}`,
        type: DUPLICATE_RECORD
      }, DUPLICATE_RECORD)
      return
    }

    const transformedDelinked = {
      ...delinked,
      calculationId: calcRef,
      applicationId: appRef
    }
    delete transformedDelinked.calculationReference
    delete transformedDelinked.applicationReference

    await validateDelinked(transformedDelinked, transformedDelinked.calculationId)

    const transaction = await db.sequelize.transaction()
    try {
      await Promise.all([
        savePlaceholderOrganisation({ sbi: transformedDelinked.sbi }, transformedDelinked.sbi, transaction),
        saveDelinked(transformedDelinked, transaction)
      ])

      await transaction.commit()
      console.info(`Successfully committed delinked: ${transformedDelinked.calculationId}`)
    } catch (txError) {
      console.error(`Transaction error for delinked ${transformedDelinked.calculationId}:`, txError)
      await transaction.rollback()
      throw txError
    }
  } catch (error) {
    const idForLog = calcRef ?? delinked?.calculationReference ?? delinked?.calculationId ?? 'unknown'
    console.error(`Failed to process delinked ${idForLog}:`, error)
    throw error
  }
}

module.exports = processDelinked
