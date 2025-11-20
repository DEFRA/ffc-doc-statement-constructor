const { DAX, D365, ORGANISATION, DELINKED, TOTAL } = require('../../../app/constants/types')

jest.mock('ffc-alerting-utils', () => ({
  dataProcessingAlert: jest.fn()
}))
jest.mock('../../../app/inbound/dax/process-dax', () => jest.fn())
jest.mock('../../../app/inbound/d365/process-d365', () => jest.fn())
jest.mock('../../../app/inbound/organisation/process-organisation', () => jest.fn())
jest.mock('../../../app/inbound/delinked/process-delinked', () => jest.fn())
jest.mock('../../../app/inbound/total/process-total', () => jest.fn())

const { dataProcessingAlert } = require('ffc-alerting-utils')
const processDax = require('../../../app/inbound/dax/process-dax')
const processD365 = require('../../../app/inbound/d365/process-d365')
const processOrganisation = require('../../../app/inbound/organisation/process-organisation')
const processDelinked = require('../../../app/inbound/delinked/process-delinked')
const processTotal = require('../../../app/inbound/total/process-total')
const processStatementData = require('../../../app/inbound/statement-data/process-statement-data')
const { DATA_PROCESSING_ERROR } = require('../../../app/constants/alerts')

describe('process-statement-data centralized alerting', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    if (console.error && console.error.mockRestore) {
      console.error.mockRestore()
    }
    if (console.warn && console.warn.mockRestore) {
      console.warn.mockRestore()
    }
  })

  test('publishes processing alert for DAX when underlying processor throws', async () => {
    const dax = { type: DAX, paymentReference: 'P-123', sbi: 'SBI-1', transactionDate: new Date('2020-01-01'), calculationReference: 'calc-1' }
    const underlyingError = new Error('dax failed')
    processDax.mockRejectedValueOnce(underlyingError)
    dataProcessingAlert.mockResolvedValueOnce()
    console.error = jest.fn()

    await expect(processStatementData(dax)).rejects.toThrow('dax failed')

    expect(console.error).toHaveBeenCalledWith(expect.stringContaining(`Error processing statement data of type ${DAX}:`), underlyingError)
    expect(dataProcessingAlert).toHaveBeenCalledTimes(1)
    const [alertPayload, alertType] = dataProcessingAlert.mock.calls[0]
    expect(alertType).toBe(DATA_PROCESSING_ERROR)
    expect(alertPayload).toMatchObject({
      process: 'process-dax',
      paymentReference: dax.paymentReference,
      sbi: dax.sbi,
      transactionDate: dax.transactionDate,
      calculationReference: dax.calculationReference,
      error: expect.any(Error)
    })
  })

  test('logs when dataProcessingAlert fails but still rethrows original error', async () => {
    const dax = { type: DAX, paymentReference: 'P-456', sbi: 'SBI-2', transactionDate: new Date('2021-02-02'), calculationReference: 'calc-2' }
    const underlyingError = new Error('dax failed again')
    processDax.mockRejectedValueOnce(underlyingError)
    dataProcessingAlert.mockRejectedValueOnce(new Error('alert publish failed'))
    console.error = jest.fn()

    await expect(processStatementData(dax)).rejects.toThrow('dax failed again')
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining(`Error processing statement data of type ${DAX}:`), underlyingError)
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining(`Failed to publish processing alert for type ${DAX}`), expect.any(Error))
    expect(dataProcessingAlert).toHaveBeenCalledTimes(1)
  })

  test('does not publish an alert when the child processor succeeds', async () => {
    const dax = { type: DAX, paymentReference: 'P-777', sbi: 'SBI-7' }
    processDax.mockResolvedValueOnce()
    await expect(processStatementData(dax)).resolves.toBeUndefined()
    expect(dataProcessingAlert).not.toHaveBeenCalled()
  })

  test('warns when type is invalid or not supported', async () => {
    console.warn = jest.fn()
    const unknown = { type: 'NOT_A_TYPE' }
    await processStatementData(unknown)
    expect(console.warn).toHaveBeenCalledWith(`Type is invalid or not supported: ${unknown.type}`)
    expect(dataProcessingAlert).not.toHaveBeenCalled()
  })

  test('D365 extractor payload shape is respected when child processor throws', async () => {
    const d365 = { type: D365, paymentReference: 'D-500', paymentAmount: 1234, transactionDate: new Date('2022-03-03') }
    const underlyingError = new Error('d365 failed')
    processD365.mockRejectedValueOnce(underlyingError)
    dataProcessingAlert.mockResolvedValueOnce()
    console.error = jest.fn()

    await expect(processStatementData(d365)).rejects.toThrow('d365 failed')
    expect(dataProcessingAlert).toHaveBeenCalledTimes(1)
    const [alertPayload, alertType] = dataProcessingAlert.mock.calls[0]
    expect(alertType).toBe(DATA_PROCESSING_ERROR)
    expect(alertPayload).toMatchObject({
      process: 'process-d365',
      paymentReference: d365.paymentReference,
      paymentAmount: d365.paymentAmount,
      transactionDate: d365.transactionDate,
      error: expect.any(Error)
    })
  })

  test('D365 extractor uses fallback transactionDate when not provided (is a Date)', async () => {
    const d365 = { type: D365, paymentReference: 'D-501', paymentAmount: 5678 }
    processD365.mockRejectedValueOnce(new Error('d365 fallback date'))
    dataProcessingAlert.mockResolvedValueOnce()
    console.error = jest.fn()

    await expect(processStatementData(d365)).rejects.toThrow('d365 fallback date')
    expect(dataProcessingAlert).toHaveBeenCalledTimes(1)
    const [alertPayload] = dataProcessingAlert.mock.calls[0]
    expect(alertPayload.transactionDate).toBeInstanceOf(Date)
  })

  test('ORGANISATION extractor includes sbi when child processor throws', async () => {
    const org = { type: ORGANISATION, sbi: 'ORG-1', somethingElse: 'x' }
    processOrganisation.mockRejectedValueOnce(new Error('org failed'))
    dataProcessingAlert.mockResolvedValueOnce()
    console.error = jest.fn()

    await expect(processStatementData(org)).rejects.toThrow('org failed')
    expect(dataProcessingAlert).toHaveBeenCalledTimes(1)
    const [alertPayload] = dataProcessingAlert.mock.calls[0]
    expect(alertPayload).toMatchObject({
      process: 'process-organisation',
      sbi: org.sbi,
      error: expect.any(Error)
    })
  })

  test('DELINKED extractor payload shape is respected when child processor throws', async () => {
    const delinked = { type: DELINKED, sbi: 'SBI-DEL', calculationId: 'calcId-1', calculationReference: 'calc-ref-1', applicationId: 'app-1' }
    processDelinked.mockRejectedValueOnce(new Error('delinked failed'))
    dataProcessingAlert.mockResolvedValueOnce()
    console.error = jest.fn()

    await expect(processStatementData(delinked)).rejects.toThrow('delinked failed')
    expect(dataProcessingAlert).toHaveBeenCalledTimes(1)
    const [alertPayload, alertType] = dataProcessingAlert.mock.calls[0]
    expect(alertType).toBe(DATA_PROCESSING_ERROR)
    expect(alertPayload).toMatchObject({
      process: 'process-delinked',
      sbi: delinked.sbi,
      calculationId: delinked.calculationId,
      calculationReference: delinked.calculationReference,
      applicationId: delinked.applicationId,
      error: expect.any(Error)
    })
  })

  test('TOTAL extractor payload shape is respected when child processor throws', async () => {
    const total = { type: TOTAL, sbi: 'SBI-TOT', agreementNumber: 'agr-1', claimReference: 'claim-1' }
    processTotal.mockRejectedValueOnce(new Error('total failed'))
    dataProcessingAlert.mockResolvedValueOnce()
    console.error = jest.fn()

    await expect(processStatementData(total)).rejects.toThrow('total failed')
    expect(dataProcessingAlert).toHaveBeenCalledTimes(1)
    const [alertPayload, alertType] = dataProcessingAlert.mock.calls[0]
    expect(alertType).toBe(DATA_PROCESSING_ERROR)
    expect(alertPayload).toMatchObject({
      process: 'process-total',
      sbi: total.sbi,
      agreementNumber: total.agreementNumber,
      claimReference: total.claimReference,
      error: expect.any(Error)
    })
  })

  test('detail extractor function names match Sonar naming regex', () => {
    const detailExtractors = processStatementData.detailExtractors
    expect(detailExtractors).toBeDefined()
    const nameRegex = /^[_a-z][a-zA-Z0-9]*$/
    const typesToCheck = [DAX, D365, ORGANISATION, DELINKED, TOTAL]
    typesToCheck.forEach(type => {
      const fn = detailExtractors[type]
      expect(typeof fn).toBe('function')
      expect(fn.name).toMatch(nameRegex)
    })
  })
})
