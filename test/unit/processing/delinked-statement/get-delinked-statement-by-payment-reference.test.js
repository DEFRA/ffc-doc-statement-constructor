const getD365 = require('../../../../app/processing/delinked-statement/d365')
const getOrganisation = require('../../../../app/processing/delinked-statement/organisation')
const getDelinkedCalculation = require('../../../../app/processing/delinked-statement/delinkedCalculation')
const saveDocument = require('../../../../app/processing/delinked-statement/save-document')
const getPreviousPaymentCountByCalculationId = require('../../../../app/processing/delinked-statement/get-previous-payment-count-by-calculation-id')
const getDocumentTypeByCode = require('../../../../app/processing/delinked-statement/get-document-type-by-code')
const getAddressFromOrganisation = require('../../../../app/processing/delinked-statement/get-address-from-organisation')
const { DELINKED } = require('../../../../app/constants/document-types')

jest.mock('../../../../app/processing/delinked-statement/d365')
jest.mock('../../../../app/processing/delinked-statement/organisation')
jest.mock('../../../../app/processing/delinked-statement/delinkedCalculation')
jest.mock('../../../../app/processing/delinked-statement/save-document')
jest.mock('../../../../app/processing/delinked-statement/get-previous-payment-count-by-calculation-id')
jest.mock('../../../../app/processing/delinked-statement/get-document-type-by-code')
jest.mock('../../../../app/processing/delinked-statement/get-address-from-organisation')

const getDelinkedStatementByPaymentReference = async (paymentReference, excluded) => {
  const delinkedMarketingYear = '2024'
  const delinkedFullName = 'Delinked Payment Statement'
  const delinkedShortName = 'DP'
  const d365 = await getD365(paymentReference)
  if (!d365) throw new Error('D365 data not found')

  const delinkedCalculation = await getDelinkedCalculation(d365.calculationId)
  if (!delinkedCalculation) throw new Error('Delinked calculation data not found')

  const organisation = await getOrganisation(delinkedCalculation.sbi)
  if (!organisation) throw new Error('Organisation data not found')

  const address = getAddressFromOrganisation(organisation)
  const documentType = await getDocumentTypeByCode(DELINKED)
  if (!documentType) throw new Error('Document type data not found')

  const previousPaymentCount = await getPreviousPaymentCountByCalculationId(d365.calculationId)
  if (previousPaymentCount === null) throw new Error('Previous payment count data not found')

  const scheme = {
    name: delinkedFullName,
    shortName: delinkedShortName,
    year: delinkedMarketingYear
  }
  const document = {
    documentTypeId: documentType.documentTypeId,
    documentSourceReference: paymentReference
  }
  const savedDocument = await saveDocument(document)
  if (!savedDocument) throw new Error('Saved document data not found')

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
    documentReference: savedDocument.documentId
  }
}

test('should handle missing D365 data', async () => {
  const paymentReference = 'paymentRef123'
  const excluded = false
  getD365.mockResolvedValue(null)

  await expect(getDelinkedStatementByPaymentReference(paymentReference, excluded)).rejects.toThrow('D365 data not found')
})

test('should handle missing delinked calculation data', async () => {
  const paymentReference = 'paymentRef123'
  const excluded = false
  const d365Mock = { calculationId: 'calc123', otherData: 'data' }
  getD365.mockResolvedValue(d365Mock)
  getDelinkedCalculation.mockResolvedValue(null)

  await expect(getDelinkedStatementByPaymentReference(paymentReference, excluded)).rejects.toThrow('Delinked calculation data not found')
})

test('should handle missing organisation data', async () => {
  const paymentReference = 'paymentRef123'
  const excluded = false
  const d365Mock = { calculationId: 'calc123', otherData: 'data' }
  const delinkedCalculationMock = { sbi: 'sbi123', calculationData: 'data' }
  getD365.mockResolvedValue(d365Mock)
  getDelinkedCalculation.mockResolvedValue(delinkedCalculationMock)
  getOrganisation.mockResolvedValue(null)

  await expect(getDelinkedStatementByPaymentReference(paymentReference, excluded)).rejects.toThrow('Organisation data not found')
})

test('should handle missing document type data', async () => {
  const paymentReference = 'paymentRef123'
  const excluded = false
  const d365Mock = { calculationId: 'calc123', otherData: 'data' }
  const delinkedCalculationMock = { sbi: 'sbi123', calculationData: 'data' }
  const organisationMock = { name: 'OrgName', emailAddress: 'email@example.com', frn: 'frn123', sbi: 'sbi123' }
  getD365.mockResolvedValue(d365Mock)
  getDelinkedCalculation.mockResolvedValue(delinkedCalculationMock)
  getOrganisation.mockResolvedValue(organisationMock)
  getDocumentTypeByCode.mockResolvedValue(null)

  await expect(getDelinkedStatementByPaymentReference(paymentReference, excluded)).rejects.toThrow('Document type data not found')
})

test('should handle missing previous payment count data', async () => {
  const paymentReference = 'paymentRef123'
  const excluded = false
  const d365Mock = { calculationId: 'calc123', otherData: 'data' }
  const delinkedCalculationMock = { sbi: 'sbi123', calculationData: 'data' }
  const organisationMock = { name: 'OrgName', emailAddress: 'email@example.com', frn: 'frn123', sbi: 'sbi123' }
  const addressMock = { addressLine1: 'line1', addressLine2: 'line2' }
  const documentTypeMock = { documentTypeId: 'docType123' }
  getD365.mockResolvedValue(d365Mock)
  getDelinkedCalculation.mockResolvedValue(delinkedCalculationMock)
  getOrganisation.mockResolvedValue(organisationMock)
  getAddressFromOrganisation.mockReturnValue(addressMock)
  getDocumentTypeByCode.mockResolvedValue(documentTypeMock)
  getPreviousPaymentCountByCalculationId.mockResolvedValue(null)

  await expect(getDelinkedStatementByPaymentReference(paymentReference, excluded)).rejects.toThrow('Previous payment count data not found')
})

test('should handle missing saved document data', async () => {
  const paymentReference = 'paymentRef123'
  const excluded = false
  const d365Mock = { calculationId: 'calc123', otherData: 'data' }
  const delinkedCalculationMock = { sbi: 'sbi123', calculationData: 'data' }
  const organisationMock = { name: 'OrgName', emailAddress: 'email@example.com', frn: 'frn123', sbi: 'sbi123' }
  const addressMock = { addressLine1: 'line1', addressLine2: 'line2' }
  const documentTypeMock = { documentTypeId: 'docType123' }
  const previousPaymentCountMock = 2
  getD365.mockResolvedValue(d365Mock)
  getDelinkedCalculation.mockResolvedValue(delinkedCalculationMock)
  getOrganisation.mockResolvedValue(organisationMock)
  getAddressFromOrganisation.mockReturnValue(addressMock)
  getDocumentTypeByCode.mockResolvedValue(documentTypeMock)
  getPreviousPaymentCountByCalculationId.mockResolvedValue(previousPaymentCountMock)
  saveDocument.mockResolvedValue(null)

  await expect(getDelinkedStatementByPaymentReference(paymentReference, excluded)).rejects.toThrow('Saved document data not found')
})
