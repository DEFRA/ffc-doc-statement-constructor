const { dataProcessingAlert } = require('ffc-alerting-utils')
const db = require('../../data')
const savePlaceholderOrganisation = require('./save-placeholder-organisation')
const getDelinkedByCalculationId = require('./get-delinked-by-calculation-id')
const saveDelinked = require('./save-delinked')
const validateDelinked = require('./validate-delinked')
const { DUPLICATE_RECORD } = require('../../constants/alerts')

const coerceNumber = (v) => (typeof v === 'string' && /^\d+$/.test(v) ? Number(v) : v)

const resolveIds = (delinked) => {
  const calcRef = coerceNumber(delinked?.calculationReference ?? delinked?.calculationId)
  const appRef = coerceNumber(delinked?.applicationReference ?? delinked?.applicationId)
  return { calcRef, appRef }
}

const processDelinked = async (delinked) => {
  const PROCESS = 'processDelinked'
  const { calcRef, appRef } = resolveIds(delinked)
  if (calcRef === undefined || calcRef === null || calcRef === '') {
    console.error('Missing calculationReference/calculationId for delinked', delinked)
    throw new Error('Missing calculationReference/calculationId')
  }

  try {
    const existing = await getDelinkedByCalculationId(calcRef)
    if (existing) {
      console.info(`Duplicate delinked received, skipping ${existing.calculationId}`)
      await dataProcessingAlert({
        process: PROCESS,
        ...delinked,
        message: `A duplicate record was received for calculation ID ${existing.calculationId}`,
        type: DUPLICATE_RECORD
      }, DUPLICATE_RECORD)
      return
    }

    const transformed = { ...delinked, calculationId: calcRef, applicationId: appRef }
    delete transformed.calculationReference
    delete transformed.applicationReference

    await validateDelinked(transformed, transformed.calculationId)

    const transaction = await db.sequelize.transaction()
    try {
      await Promise.all([
        savePlaceholderOrganisation({ sbi: transformed.sbi }, transformed.sbi, transaction),
        saveDelinked(transformed, transaction)
      ])
      await transaction.commit()
      console.info(`Successfully committed delinked: ${transformed.calculationId}`)
    } catch (err) {
      await transaction.rollback()
      console.error(`Transaction error for delinked ${transformed.calculationId}:`, err)
      throw err
    }
  } catch (err) {
    const idForLog = calcRef ?? delinked?.calculationReference ?? delinked?.calculationId ?? 'unknown'
    console.error(`Failed to process delinked ${idForLog}:`, err)
    throw err
  }
}

module.exports = processDelinked
