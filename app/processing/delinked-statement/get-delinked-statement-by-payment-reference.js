const getD365 = require('./d365')
const getOrganisation = require('./organisation')
const getDelinkedCalculation = require('./delinkedCalculation')
const saveDocument = require('./save-document')
const getPreviousPaymentCountByCalculationId = require('./get-previous-payment-count-by-calculation-id')
const getDocumentTypeByCode = require('./get-document-type-by-code')
const getAddressFromOrganisation = require('./get-address-from-organisation')
const { DELINKED } = require('../../constants/document-types')

const getDelinkedStatementByPaymentReference = async (paymentReference, excluded) => {
  const delinkedMarketingYear = '2024'
  const delinkedFullName = 'Delinked Payment Statement'
  const delinkedShortName = 'DP'
  const d365 = await getD365(paymentReference)
  const delinkedCalculation = await getDelinkedCalculation(d365.calculationId)
  const organisation = await getOrganisation(delinkedCalculation.sbi)
  const address = getAddressFromOrganisation(organisation)
  const { documentTypeId } = await getDocumentTypeByCode(DELINKED)
  const previousPaymentCount = await getPreviousPaymentCountByCalculationId(d365.calculationId)
  const scheme = {
    name: delinkedFullName,
    shortName: delinkedShortName,
    year: delinkedMarketingYear
  }
  const document = {
    documentTypeId,
    documentSourceReference: paymentReference
  }
  const { documentId } = await saveDocument(document)
  return {
    address,
    businessName: organisation.name,
    email: organisation.emailAddress,
    frn: organisation.frn,
    sbi: organisation.sbi,
    ...d365,
    ...delinkedCalculation,
    scheme,
    previousPaymentCount,
    documentReference: documentId
  }
}

module.exports = getDelinkedStatementByPaymentReference
