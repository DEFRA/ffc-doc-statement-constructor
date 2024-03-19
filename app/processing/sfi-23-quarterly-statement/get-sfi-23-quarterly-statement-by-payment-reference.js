const getDax = require('./dax')
const getOrganisation = require('./organisation')
const getTotal = require('./total')
const getScheme = require('./scheme')
const getActionGroups = require('./action-groups')
const saveDocument = require('./save-document')
const getPreviousPaymentCountByCalculationId = require('./get-previous-payment-count-by-document-id')
const getDocumentTypeByCode = require('./get-documentType-by-code')

const { SFI23QUARTERLYSTATEMENT } = require('../../constants/document-types')

const getSfi23QuarterlyStatementByPaymentReference = async (paymentReference) => {
  const dax = await getDax(paymentReference)
  const total = await getTotal(dax.calculationId)
  const organisation = await getOrganisation(total.sbi)
  const scheme = await getScheme(total.schemeCode)
  const actionGroups = await getActionGroups(total.calculationReference)
  const { documentTypeId } = await getDocumentTypeByCode(SFI23QUARTERLYSTATEMENT)
  const previousPaymentCount = await getPreviousPaymentCountByCalculationId(dax.calculationId)

  const document = {
    documentTypeId,
    documentSourceReference: paymentReference
  }

  const { documentId } = await saveDocument(document)

  return {
    ...organisation,
    ...dax,
    ...total,
    ...scheme,
    actionGroups,
    previousPaymentCount,
    documentReference: documentId
  }
}

module.exports = getSfi23QuarterlyStatementByPaymentReference
