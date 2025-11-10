jest.mock('../../../../app/processing/sfi-23-quarterly-statement/organisation')
const getOrganisation = require('../../../../app/processing/sfi-23-quarterly-statement/organisation')

jest.mock('../../../../app/processing/sfi-23-quarterly-statement/total')
const getTotal = require('../../../../app/processing/sfi-23-quarterly-statement/total')

jest.mock('../../../../app/processing/sfi-23-quarterly-statement/action-groups')
const getActionGroups = require('../../../../app/processing/sfi-23-quarterly-statement/action-groups')

jest.mock('../../../../app/processing/sfi-23-quarterly-statement/save-document')
const saveDocument = require('../../../../app/processing/sfi-23-quarterly-statement/save-document')

jest.mock('../../../../app/processing/sfi-23-quarterly-statement/get-previous-payment-count-by-document-id')
const getPreviousPaymentCountByCalculationId = require('../../../../app/processing/sfi-23-quarterly-statement/get-previous-payment-count-by-document-id')

jest.mock('../../../../app/processing/sfi-23-quarterly-statement/get-document-type-by-code')
const getDocumentTypeByCode = require('../../../../app/processing/sfi-23-quarterly-statement/get-document-type-by-code')

jest.mock('../../../../app/processing/sfi-23-quarterly-statement/get-address-from-organisation')
const getAddressFromOrganisation = require('../../../../app/processing/sfi-23-quarterly-statement/get-address-from-organisation')

const getSfi23QuarterlyStatement = require('../../../../app/processing/sfi-23-quarterly-statement/get-sfi-23-quarterly-statement')

const paymentReference = 'PY12345670'

describe('getSfi23QuarterlyStatement', () => {
  beforeEach(() => {
    const loadMock = (name) => JSON.parse(JSON.stringify(require(`../../../mock-objects/mock-${name}`)))

    const organisation = loadMock('organisation')
    const total = loadMock('total')
    const actionGroups = loadMock('action-groups')
    const savedDocument = { documentId: 2 }
    const previousPaymentCount = 1
    const documentType = { documentTypeId: 1 }
    const address = {
      line1: '123 Main St',
      line2: 'Apt 4B',
      line3: 'Building C',
      line4: 'Cityville',
      line5: 'Countyshire',
      postcode: '12345'
    }

    getOrganisation.mockResolvedValue(organisation)
    getTotal.mockResolvedValue(total)
    getActionGroups.mockResolvedValue(actionGroups)
    saveDocument.mockResolvedValue(savedDocument)
    getPreviousPaymentCountByCalculationId.mockResolvedValue(previousPaymentCount)
    getDocumentTypeByCode.mockResolvedValue(documentType)
    getAddressFromOrganisation.mockResolvedValue(address)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getOrganisation with the payment reference', async () => {
    await getSfi23QuarterlyStatement(paymentReference)
    expect(getOrganisation).toHaveBeenCalledWith(paymentReference)
  })

  test('should call getTotal', async () => {
    await getSfi23QuarterlyStatement(paymentReference)
    expect(getTotal).toHaveBeenCalled()
  })

  test('should call getActionGroups', async () => {
    await getSfi23QuarterlyStatement(paymentReference)
    expect(getActionGroups).toHaveBeenCalled()
  })

  test('should call saveDocument', async () => {
    await getSfi23QuarterlyStatement(paymentReference)
    expect(saveDocument).toHaveBeenCalled()
  })

  test('should call getPreviousPaymentCountByCalculationId', async () => {
    await getSfi23QuarterlyStatement(paymentReference)
    expect(getPreviousPaymentCountByCalculationId).toHaveBeenCalled()
  })

  test('should call getDocumentTypeByCode', async () => {
    await getSfi23QuarterlyStatement(paymentReference)
    expect(getDocumentTypeByCode).toHaveBeenCalled()
  })

  test('should call getAddressFromOrganisation', async () => {
    await getSfi23QuarterlyStatement(paymentReference)
    expect(getAddressFromOrganisation).toHaveBeenCalled()
  })

  test('should return expected statement object', async () => {
    const result = await getSfi23QuarterlyStatement(paymentReference)

    expect(result).toEqual(expect.objectContaining({
      organisation: expect.any(Object),
      total: expect.any(Object),
      actionGroups: expect.any(Array),
      document: expect.any(Object),
      previousPaymentCount: 1,
      address: expect.objectContaining({
        line1: '123 Main St',
        postcode: '12345'
      })
    }))
  })

  test('should throw an error if getOrganisation fails', async () => {
    getOrganisation.mockRejectedValueOnce(new Error('Organisation not found'))

    await expect(getSfi23QuarterlyStatement(paymentReference))
      .rejects.toThrow('Organisation not found')
  })
})
