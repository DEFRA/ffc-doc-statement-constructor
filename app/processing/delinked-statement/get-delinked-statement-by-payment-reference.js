const getD365 = require('./d365')
const getOrganisation = require('./organisation')
const getDelinkedCalculation = require('./delinkedCalculation')
const saveDocument = require('./save-document')
const getPreviousPaymentCountByCalculationId = require('./get-previous-payment-count-by-calculation-id')
const getDocumentTypeByCode = require('./get-document-type-by-code')
const getAddressFromOrganisation = require('./get-address-from-organisation')
const { DELINKED } = require('../../constants/document-types')
const delinkedScheme = require('../../constants/delinked-scheme')

const getDelinkedStatementByPaymentReference = async (paymentReference, excluded) => {
  const d365 = await getD365(paymentReference)
  if (!d365) {
    throw new Error(`D365 data not found for payment reference: ${paymentReference}`)
  }

  const delinkedCalculation = await getDelinkedCalculation(d365.calculationId)
  if (!delinkedCalculation) {
    throw new Error(`Delinked calculation data not found for calculation ID: ${d365.calculationId}`)
  }

  const organisation = await getOrganisation(delinkedCalculation.sbi)
  if (!organisation) {
    throw new Error(`Organisation data not found for SBI: ${delinkedCalculation.sbi}`)
  }

  const address = getAddressFromOrganisation(organisation)
  if (!address) {
    throw new Error(`Address data not found for organisation: ${organisation.name}`)
  }

  const documentType = await getDocumentTypeByCode(DELINKED)
  if (!documentType?.documentTypeId) {
    throw new Error(`Invalid document type code: ${DELINKED}`)
  }

  const previousPaymentCount = await getPreviousPaymentCountByCalculationId(d365.calculationId)
  if (previousPaymentCount === null || typeof previousPaymentCount !== 'number') {
    throw new Error(`Invalid previous payment count for calculation ID: ${d365.calculationId}`)
  }

  console.log('D365 data loaded:', JSON.stringify({
    paymentReference: d365.paymentReference,
    calculationId: d365.calculationId,
    marketingYear: d365.marketingYear
  }, null, 2))

  const scheme = (() => {
    const createdScheme = delinkedScheme.createScheme(d365.marketingYear)
    return {
      name: createdScheme.fullName,
      shortName: createdScheme.shortName,
      year: createdScheme.year
    }
  })()

  const document = {
    documentTypeId: documentType.documentTypeId,
    documentSourceReference: paymentReference
  }

  const savedDocument = await saveDocument(document)
  if (!savedDocument?.documentId) {
    throw new Error(`Invalid saved document data for payment reference: ${paymentReference}`)
  }

  return {
    address,
    businessName: organisation.name,
    email: organisation.emailAddress,
    frn: organisation.frn,
    sbi: organisation.sbi,
    ...delinkedCalculation,
    ...d365,
    scheme,
    previousPaymentCount,
    documentReference: savedDocument.documentId,
    excludedFromNotify: excluded
  }
}

module.exports = getDelinkedStatementByPaymentReference
