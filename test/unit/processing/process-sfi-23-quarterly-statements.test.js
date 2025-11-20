jest.mock('../../../app/processing/sfi-23-quarterly-statement')
const {
  getVerifiedDaxsSfi23QuarterlyStatements,
  sendSfi23QuarterlyStatement,
  updateDaxCompletePublishByDaxId,
  resetDaxUnCompletePublishByDaxId,
  getSfi23QuarterlyStatement
} = require('../../../app/processing/sfi-23-quarterly-statement')

jest.mock('../../../app/processing/sfi-23-quarterly-statement/dax/validate-dax', () => jest.fn())

const processSfi23QuarterlyStatements = require('../../../app/processing/process-sfi-23-quarterly-statements')
jest.mock('../../../app/utility/get-excluded-payment-reference-by-payment-reference')
const getExcludedPaymentReferenceByPaymentReference = require('../../../app/utility/get-excluded-payment-reference-by-payment-reference')

let retrievedDax

describe('process statements', () => {
  beforeEach(async () => {
    const dax = structuredClone(require('../../mock-objects/mock-dax'))
    retrievedDax = [
      { ...dax, paymentReference: 'P1', daxId: 1 },
      { ...dax, paymentReference: 'P2', daxId: 2 },
      { ...dax, paymentReference: 'P3', daxId: 3 }
    ]

    getVerifiedDaxsSfi23QuarterlyStatements.mockResolvedValue(retrievedDax)
    updateDaxCompletePublishByDaxId.mockResolvedValue(undefined)
    resetDaxUnCompletePublishByDaxId.mockResolvedValue(undefined)
    getSfi23QuarterlyStatement.mockResolvedValue(undefined)
    getExcludedPaymentReferenceByPaymentReference.mockResolvedValue(null)
    sendSfi23QuarterlyStatement.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getVerifiedDaxsSfi23QuarterlyStatements', async () => {
    await processSfi23QuarterlyStatements()
    expect(getVerifiedDaxsSfi23QuarterlyStatements).toHaveBeenCalled()
  })

  test('should call getExcludedPaymentReferenceByPaymentReference for each dax', async () => {
    await processSfi23QuarterlyStatements()
    expect(getExcludedPaymentReferenceByPaymentReference).toHaveBeenCalledTimes(retrievedDax.length)
    retrievedDax.forEach(dax => {
      expect(getExcludedPaymentReferenceByPaymentReference).toHaveBeenCalledWith(dax.paymentReference)
    })
  })

  test('should call getSfi23QuarterlyStatement for each dax', async () => {
    await processSfi23QuarterlyStatements()
    expect(getSfi23QuarterlyStatement).toHaveBeenCalledTimes(retrievedDax.length)
  })

  test('should call sendSfi23QuarterlyStatement for each dax', async () => {
    await processSfi23QuarterlyStatements()
    expect(sendSfi23QuarterlyStatement).toHaveBeenCalledTimes(retrievedDax.length)
  })

  test('should call updateDaxCompletePublishByDaxId for each dax', async () => {
    await processSfi23QuarterlyStatements()
    expect(updateDaxCompletePublishByDaxId).toHaveBeenCalledTimes(retrievedDax.length)
    retrievedDax.forEach(dax => {
      expect(updateDaxCompletePublishByDaxId).toHaveBeenCalledWith(dax.daxId)
    })
  })

  test('should call resetDaxUnCompletePublishByDaxId for each dax', async () => {
    await processSfi23QuarterlyStatements()
    expect(resetDaxUnCompletePublishByDaxId).toHaveBeenCalledTimes(retrievedDax.length)
    retrievedDax.forEach(dax => {
      expect(resetDaxUnCompletePublishByDaxId).toHaveBeenCalledWith(dax.daxId)
    })
  })

  test('should log and skip sending statement if payment reference is excluded', async () => {
    getExcludedPaymentReferenceByPaymentReference.mockImplementation((paymentReference) =>
      paymentReference === 'P2' ? true : null
    )
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => { })
    await processSfi23QuarterlyStatements()
    expect(logSpy).toHaveBeenCalledWith(
      'Payment reference P2 is excluded from SFI-23 quarterly statement processing'
    )
    logSpy.mockRestore()
  })
})
