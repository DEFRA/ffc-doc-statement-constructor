const db = require('../data')
const { DELINKED } = require('../constants/scheme-ids')
const { findDelinkedCalculations } = require('./find-delinked-calculations')
const { removeD365 } = require('./remove-d365')
const { removeDelinkedCalculations } = require('./remove-delinked-calculations')
const { findD365s } = require('./find-d365s')
const { removeDocuments } = require('./remove-documents')
const { removeExcludedPaymentReferences } = require('./remove-excluded-payment-references')

const removeAgreementData = async (retentionData) => {
  const transaction = await db.sequelize.transaction()
  try {
    const { simplifiedAgreementNumber, frn, schemeId } = retentionData

    if (schemeId !== DELINKED) {
      await transaction.commit()
      return
    }

    const calculations = await findDelinkedCalculations(simplifiedAgreementNumber, frn, transaction)
    const calculationIds = calculations.map(c => c.calculationId)
    if (calculations.length === 0) {
      await transaction.commit()
      return
    }

    const d365s = await findD365s(calculationIds, transaction)
    const paymentReferences = d365s.map(d365 => d365.paymentReference)

    await removeDocuments(paymentReferences, transaction)
    await removeExcludedPaymentReferences(paymentReferences, transaction)
    await removeD365(calculationIds, transaction)
    await removeDelinkedCalculations(calculationIds, transaction)

    await transaction.commit()
  } catch (err) {
    await transaction.rollback()
    throw err
  }
}

module.exports = {
  removeAgreementData
}
