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

const getDelinkedStatementByPaymentReference = require('../../../../app/processing/delinked-statement/get-delinked-statement-by-payment-reference')

test('should handle missing D365 data', async () => {
  const paymentReference = 'paymentRef123'
  const excluded = false
  getD365.mockResolvedValue(null)

  await expect(getDelinkedStatementByPaymentReference(paymentReference, excluded)).rejects.toThrow('D365 data not found for payment reference: paymentRef123')
})

test('should handle missing delinked calculation data', async () => {
  const paymentReference = 'paymentRef123'
  const excluded = false
  const d365Mock = { calculationId: 'calc123', otherData: 'data' }
  getD365.mockResolvedValue(d365Mock)
  getDelinkedCalculation.mockResolvedValue(null)

  await expect(getDelinkedStatementByPaymentReference(paymentReference, excluded)).rejects.toThrow('Delinked calculation data not found for calculation ID: calc123')
})

test('should handle missing organisation data', async () => {
  const paymentReference = 'paymentRef123'
  const excluded = false
  const d365Mock = { calculationId: 'calc123', otherData: 'data' }
  const delinkedCalculationMock = { sbi: 'sbi123', calculationData: 'data' }
  getD365.mockResolvedValue(d365Mock)
  getDelinkedCalculation.mockResolvedValue(delinkedCalculationMock)
  getOrganisation.mockResolvedValue(null)

  await expect(getDelinkedStatementByPaymentReference(paymentReference, excluded)).rejects.toThrow('Organisation data not found for SBI: sbi123')
})

test('should handle missing address data', async () => {
  const paymentReference = 'paymentRef123'
  const excluded = false
  const d365Mock = { calculationId: 'calc123', otherData: 'data' }
  const delinkedCalculationMock = { sbi: 'sbi123', calculationData: 'data' }
  const organisationMock = { name: 'OrgName', emailAddress: 'email@example.com', frn: 'frn123', sbi: 'sbi123' }
  const documentTypeMock = { documentTypeId: 'docType123' }
  const previousPaymentCountMock = 2
  const savedDocumentMock = { documentId: 'docId123' }

  getD365.mockResolvedValue(d365Mock)
  getDelinkedCalculation.mockResolvedValue(delinkedCalculationMock)
  getOrganisation.mockResolvedValue(organisationMock)
  getAddressFromOrganisation.mockReturnValue(null)
  getDocumentTypeByCode.mockResolvedValue(documentTypeMock)
  getPreviousPaymentCountByCalculationId.mockResolvedValue(previousPaymentCountMock)
  saveDocument.mockResolvedValue(savedDocumentMock)

  await expect(getDelinkedStatementByPaymentReference(paymentReference, excluded)).rejects.toThrow('Address data not found for organisation: OrgName')
})

test('should handle missing document type data', async () => {
  const paymentReference = 'paymentRef123'
  const excluded = false
  const d365Mock = { calculationId: 'calc123', otherData: 'data' }
  const delinkedCalculationMock = { sbi: 'sbi123', calculationData: 'data' }
  const organisationMock = { name: 'OrgName', emailAddress: 'email@example.com', frn: 'frn123', sbi: 'sbi123' }
  const addressMock = { addressLine1: 'line1', addressLine2: 'line2' }
  const previousPaymentCountMock = 2
  const savedDocumentMock = { documentId: 'docId123' }

  getD365.mockResolvedValue(d365Mock)
  getDelinkedCalculation.mockResolvedValue(delinkedCalculationMock)
  getOrganisation.mockResolvedValue(organisationMock)
  getAddressFromOrganisation.mockReturnValue(addressMock)
  getDocumentTypeByCode.mockResolvedValue(null)
  getPreviousPaymentCountByCalculationId.mockResolvedValue(previousPaymentCountMock)
  saveDocument.mockResolvedValue(savedDocumentMock)

  await expect(getDelinkedStatementByPaymentReference(paymentReference, excluded)).rejects.toThrow('Invalid document type code: DELINKED')
})

test('should handle missing previous payment count data', async () => {
  const paymentReference = 'paymentRef123'
  const excluded = false
  const d365Mock = { calculationId: 'calc123', otherData: 'data' }
  const delinkedCalculationMock = { sbi: 'sbi123', calculationData: 'data' }
  const organisationMock = { name: 'OrgName', emailAddress: 'email@example.com', frn: 'frn123', sbi: 'sbi123' }
  const addressMock = { addressLine1: 'line1', addressLine2: 'line2' }
  const documentTypeMock = { documentTypeId: 'docType123' }
  const savedDocumentMock = { documentId: 'docId123' }

  getD365.mockResolvedValue(d365Mock)
  getDelinkedCalculation.mockResolvedValue(delinkedCalculationMock)
  getOrganisation.mockResolvedValue(organisationMock)
  getAddressFromOrganisation.mockReturnValue(addressMock)
  getDocumentTypeByCode.mockResolvedValue(documentTypeMock)
  getPreviousPaymentCountByCalculationId.mockResolvedValue(null)
  saveDocument.mockResolvedValue(savedDocumentMock)

  await expect(getDelinkedStatementByPaymentReference(paymentReference, excluded)).rejects.toThrow('Invalid previous payment count for calculation ID: calc123')
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

  await expect(getDelinkedStatementByPaymentReference(paymentReference, excluded)).rejects.toThrow('Invalid saved document data for payment reference: paymentRef123')
})

test('should return delinked statement data successfully', async () => {
  const paymentReference = 'paymentRef123'
  const excluded = false
  const d365Mock = { calculationId: 'calc123', otherData: 'data' }
  const delinkedCalculationMock = { sbi: 'sbi123', calculationData: 'data' }
  const organisationMock = { name: 'OrgName', emailAddress: 'email@example.com', frn: 'frn123', sbi: 'sbi123' }
  const addressMock = { addressLine1: 'line1', addressLine2: 'line2' }
  const documentTypeMock = { documentTypeId: 'docType123' }
  const previousPaymentCountMock = 2
  const savedDocumentMock = { documentId: 'docId123' }

  getD365.mockResolvedValue(d365Mock)
  getDelinkedCalculation.mockResolvedValue(delinkedCalculationMock)
  getOrganisation.mockResolvedValue(organisationMock)
  getAddressFromOrganisation.mockReturnValue(addressMock)
  getDocumentTypeByCode.mockResolvedValue(documentTypeMock)
  getPreviousPaymentCountByCalculationId.mockResolvedValue(previousPaymentCountMock)
  saveDocument.mockResolvedValue(savedDocumentMock)

  const result = await getDelinkedStatementByPaymentReference(paymentReference, excluded)

  expect(result).toEqual({
    address: addressMock,
    businessName: organisationMock.name,
    email: organisationMock.emailAddress,
    frn: organisationMock.frn,
    sbi: organisationMock.sbi,
    ...d365Mock,
    ...delinkedCalculationMock,
    scheme: {
      name: 'Delinked Payment Statement',
      shortName: 'DP',
      year: '2024'
    },
    previousPaymentCount: previousPaymentCountMock,
    documentReference: savedDocumentMock.documentId
  })
})

test('should use DELINKED document type code', async () => {
  const paymentReference = 'paymentRef123'
  const excluded = false
  const d365Mock = { calculationId: 'calc123', otherData: 'data' }
  const delinkedCalculationMock = { sbi: 'sbi123', calculationData: 'data' }
  const organisationMock = { name: 'OrgName', emailAddress: 'email@example.com', frn: 'frn123', sbi: 'sbi123' }
  const addressMock = { addressLine1: 'line1', addressLine2: 'line2' }
  const documentTypeMock = { documentTypeId: 'docType123' }
  const previousPaymentCountMock = 2
  const savedDocumentMock = { documentId: 'docId123' }

  getD365.mockResolvedValue(d365Mock)
  getDelinkedCalculation.mockResolvedValue(delinkedCalculationMock)
  getOrganisation.mockResolvedValue(organisationMock)
  getAddressFromOrganisation.mockReturnValue(addressMock)
  getDocumentTypeByCode.mockResolvedValue(documentTypeMock)
  getPreviousPaymentCountByCalculationId.mockResolvedValue(previousPaymentCountMock)
  saveDocument.mockResolvedValue(savedDocumentMock)

  await getDelinkedStatementByPaymentReference(paymentReference, excluded)

  expect(getDocumentTypeByCode).toHaveBeenCalledWith(DELINKED)
})
