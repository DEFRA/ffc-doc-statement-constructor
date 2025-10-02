const { dataProcessingAlert } = require('ffc-alerting-utils')
const getD365 = require('./d365')
const getOrganisation = require('./organisation')
const getDelinkedCalculation = require('./delinkedCalculation')
const saveDocument = require('./save-document')
const getPreviousPaymentCountByCalculationId = require('./get-previous-payment-count-by-calculation-id')
const getDocumentTypeByCode = require('./get-document-type-by-code')
const getAddressFromOrganisation = require('./get-address-from-organisation')
const { DELINKED } = require('../../constants/document-types')
const delinkedScheme = require('../../constants/delinked-scheme')
const { DATA_PROCESSING_ERROR } = require('../../../app/constants/alerts')

const alertAndThrow = async (alertPayload, throwMessage) => {
  try {
    await dataProcessingAlert(alertPayload, DATA_PROCESSING_ERROR)
  } catch (alertError) {
    console.error(throwMessage, alertError)
  }
  throw new Error(throwMessage)
}

const loadD365 = async (paymentReference) => {
  const d365 = await getD365(paymentReference)
  if (!d365) {
    throw new Error(`D365 data not found for payment reference: ${paymentReference}`)
  }
  return d365
}

const loadDelinkedCalculation = async (calculationId) => {
  const delinkedCalculation = await getDelinkedCalculation(calculationId)
  if (!delinkedCalculation) {
    await alertAndThrow({
      process: 'getDelinkedCalculation',
      calculationId,
      message: `Delinked calculation data not found for calculation ID: ${calculationId}`
    }, `Delinked calculation data not found for calculation ID: ${calculationId}`)
  }
  return delinkedCalculation
}

const loadOrganisation = async (sbi) => {
  const organisation = await getOrganisation(sbi)
  if (!organisation) {
    await alertAndThrow({
      process: 'getOrganisation',
      sbi,
      message: `Organisation data not found for SBI: ${sbi}`
    }, `Organisation data not found for SBI: ${sbi}`)
  }
  return organisation
}

const loadAddress = async (organisation) => {
  const address = getAddressFromOrganisation(organisation)
  if (!address) {
    await alertAndThrow({
      process: 'getAddressFromOrganisation',
      organisation: organisation?.name,
      message: `Address data not found for organisation: ${organisation?.name}`
    }, `Address data not found for organisation: ${organisation?.name}`)
  }
  return address
}

const loadDocumentType = async (typeCode) => {
  const documentType = await getDocumentTypeByCode(typeCode)
  if (!documentType?.documentTypeId) {
    await alertAndThrow({
      process: 'getDocumentTypeByCode',
      type: typeCode,
      message: `Invalid document type code: ${typeCode}`
    }, `Invalid document type code: ${typeCode}`)
  }
  return documentType
}

const loadPreviousPaymentCount = async (calculationId) => {
  const previousPaymentCount = await getPreviousPaymentCountByCalculationId(calculationId)
  if (previousPaymentCount === null || typeof previousPaymentCount !== 'number') {
    await alertAndThrow({
      process: 'getPreviousPaymentCountByCalculationId',
      calculationId,
      message: `Invalid previous payment count for calculation ID: ${calculationId}`
    }, `Invalid previous payment count for calculation ID: ${calculationId}`)
  }
  return previousPaymentCount
}

const createSchemeFromD365 = (d365) => {
  const createdScheme = delinkedScheme.createScheme(d365.marketingYear)
  return {
    name: createdScheme.fullName,
    shortName: createdScheme.shortName,
    year: createdScheme.year
  }
}

const createAndSaveDocument = async (documentTypeId, paymentReference) => {
  const document = {
    documentTypeId,
    documentSourceReference: paymentReference
  }
  const savedDocument = await saveDocument(document)
  if (!savedDocument?.documentId) {
    await alertAndThrow({
      process: 'saveDocument',
      paymentReference,
      message: `Invalid saved document data for payment reference: ${paymentReference}`
    }, `Invalid saved document data for payment reference: ${paymentReference}`)
  }
  return savedDocument
}

const getDelinkedStatementByPaymentReference = async (paymentReference, excluded) => {
  const d365 = await loadD365(paymentReference)
  const delinkedCalculation = await loadDelinkedCalculation(d365.calculationId)
  const organisation = await loadOrganisation(delinkedCalculation.sbi)
  const address = await loadAddress(organisation)
  const documentType = await loadDocumentType(DELINKED)
  const previousPaymentCount = await loadPreviousPaymentCount(d365.calculationId)

  console.log('D365 data loaded:', JSON.stringify({
    paymentReference: d365.paymentReference,
    calculationId: d365.calculationId,
    marketingYear: d365.marketingYear
  }, null, 2))

  const scheme = createSchemeFromD365(d365)
  const savedDocument = await createAndSaveDocument(documentType.documentTypeId, paymentReference)

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
