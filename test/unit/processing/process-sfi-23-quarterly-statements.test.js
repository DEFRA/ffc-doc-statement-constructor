jest.mock('../../../app/processing/sfi-23-quarterly-statement')
const {
  getVerifiedDaxsSfi23QuarterlyStatements,
  sendSfi23QuarterlyStatement,
  updateDaxCompletePublishByDaxId,
  resetDaxUnCompletePublishByDaxId,
  getSfi23QuarterlyStatementByPaymentReference,
  getExcludedPaymentReferenceByPaymentReference
} = require('../../../app/processing/sfi-23-quarterly-statement')

const processSfi23QuarterlyStatements = require('../../../app/processing/process-sfi-23-quarterly-statements')

let retrievedDax

describe('process statements', () => {
  beforeEach(async () => {
    const dax = JSON.parse(JSON.stringify(require('../../mock-objects/mock-dax')))
    retrievedDax = [{ ...dax }, { ...dax, paymentReference: 'P54542352' }, { ...dax, paymentReference: 'P545882352' }]

    getVerifiedDaxsSfi23QuarterlyStatements.mockResolvedValue([retrievedDax])
    updateDaxCompletePublishByDaxId.mockReturnValue(undefined)
    resetDaxUnCompletePublishByDaxId.mockResolvedValue(undefined)
    getSfi23QuarterlyStatementByPaymentReference.mockResolvedValue(undefined)
    getExcludedPaymentReferenceByPaymentReference.mockResolvedValue(null)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call getVerifiedDaxsSfi23QuarterlyStatements', async () => {
    await processSfi23QuarterlyStatements()
    expect(getVerifiedDaxsSfi23QuarterlyStatements).toHaveBeenCalled()
  })

  test('should call getExcludedPaymentReferenceByPaymentReference', async () => {
    await processSfi23QuarterlyStatements()
    expect(getExcludedPaymentReferenceByPaymentReference).toHaveBeenCalled()
  })

  test('should call getSfi23QuarterlyStatementByPaymentReference', async () => {
    await processSfi23QuarterlyStatements()
    expect(getSfi23QuarterlyStatementByPaymentReference).toHaveBeenCalled()
  })

  test('should call sendSfi23QuarterlyStatement', async () => {
    await processSfi23QuarterlyStatements()
    expect(sendSfi23QuarterlyStatement).toHaveBeenCalled()
  })

  test('should call updateDaxCompletePublishByDaxId', async () => {
    await processSfi23QuarterlyStatements()
    expect(updateDaxCompletePublishByDaxId).toHaveBeenCalled()
  })

  test('should call resetDaxUnCompletePublishByDaxId', async () => {
    await processSfi23QuarterlyStatements()
    expect(resetDaxUnCompletePublishByDaxId).not.toHaveBeenCalled()
  })
})
