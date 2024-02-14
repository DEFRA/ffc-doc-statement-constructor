const db = require('../../../../app/data')

const { getStatement } = require('../../../../app/processing/statement')

let paymentRequestIdInProgress
let paymentRequestIdCompleted

let settlement

let schedule
let statement

describe('get statement', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    const calculation = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-calculation')))
    const organisation = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-organisation')))

    const schemes = JSON.parse(JSON.stringify(require('../../../../app/constants/schemes')))
    const {
      SFI_FIRST_PAYMENT: invoiceNumber,
      SFI_FIRST_PAYMENT_ORIGINAL: originalInvoiceNumber
    } = JSON.parse(JSON.stringify(require('../../../mock-components/mock-invoice-number')))
    const fundingOptions = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-funding-options')))
    const fundings = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-fundings')))[1]

    settlement = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-settlement')))

    let paymentRequestInProgress = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').processingPaymentRequest))
    paymentRequestIdInProgress = 1
    paymentRequestInProgress = { ...paymentRequestInProgress, paymentRequestId: paymentRequestIdInProgress, sourceSystem: 'SFIA' }

    let paymentRequestCompleted = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').submitPaymentRequest))
    paymentRequestIdCompleted = 2
    paymentRequestCompleted = { ...paymentRequestCompleted, paymentRequestId: paymentRequestIdCompleted, sourceSystem: 'SFIA' }

    const invoiceLineInProgress = paymentRequestInProgress.invoiceLines.map(x => { return { ...x, fundingCode: x.schemeCode, paymentRequestId: paymentRequestIdInProgress } })[0]
    const invoiceLineCompleted = paymentRequestCompleted.invoiceLines.map(x => { return { ...x, fundingCode: x.schemeCode, paymentRequestId: paymentRequestIdCompleted } })[0]
    const claimAgreementNumber = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-claim-agreement')))

    await db.scheme.bulkCreate(schemes)
    await db.fundingOption.bulkCreate(fundingOptions)
    await db.invoiceNumber.create({ invoiceNumber, originalInvoiceNumber })
    await db.paymentRequest.bulkCreate([paymentRequestInProgress, paymentRequestCompleted])
    await db.invoiceLine.bulkCreate([invoiceLineInProgress, invoiceLineCompleted])
    await db.organisation.create(organisation)
    await db.calculation.create({ ...calculation, paymentRequestId: paymentRequestIdInProgress })
    await db.funding.create({ ...fundings, calculationId: 1 })
    await db.settlement.create({ ...settlement, paymentRequestId: paymentRequestIdCompleted })
    await db.claimAgreement.bulkCreate(claimAgreementNumber)

    schedule = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-schedule').STATEMENT))
    schedule = {
      ...schedule,
      scheduleId: 1
    }

    statement = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-statement')))
  })

  afterEach(async () => {
    jest.clearAllMocks()

    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  describe('when all information is present', () => {
    test('returns frn key', async () => {
      const result = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(Object.keys(result)).toContain('frn')
    })

    test('returns frn as number', async () => {
      const result = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(result.frn).toEqual(expect.any(Number))
    })

    test('returns frn as statement.frn', async () => {
      const result = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(result.frn).toEqual(statement.frn)
    })

    test('returns sbi key', async () => {
      const result = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(Object.keys(result)).toContain('sbi')
    })

    test('returns sbi as number', async () => {
      const result = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(result.sbi).toEqual(expect.any(Number))
    })

    test('returns sbi as statement.sbi', async () => {
      const result = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(result.sbi).toEqual(statement.sbi)
    })

    test('returns funding key', async () => {
      const result = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(Object.keys(result)).toContain('funding')
    })

    test('returns funding as array', async () => {
      const result = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(result.funding).toEqual(expect.any(Array))
    })

    test('returns annualValue key within funding key', async () => {
      const result = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(Object.keys(result.funding[0])).toContain('annualValue')
    })

    test('returns annualValue as string', async () => {
      const result = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(result.funding[0].annualValue).toEqual(expect.any(String))
    })

    test('returns area key within funding key', async () => {
      const result = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(Object.keys(result.funding[0])).toContain('area')
    })

    test('returns payments key', async () => {
      const result = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(Object.keys(result)).toContain('payments')
    })

    test('returns payments as array', async () => {
      const result = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(result.payments).toEqual(expect.any(Array))
    })

    test('returns value key within payments key', async () => {
      const result = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(Object.keys(result.payments[0])).toContain('value')
    })

    test('returns value as string', async () => {
      const result = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(result.payments[0].value).toEqual(expect.any(String))
    })

    test('returns value as statement.payments.value', async () => {
      const result = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(result.payments[0].value).toEqual(statement.payments[0].value)
    })

    test('returns scheme key', async () => {
      const result = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(Object.keys(result)).toContain('scheme')
    })

    test('returns scheme as object', async () => {
      const result = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(result.scheme).toEqual(expect.any(Object))
    })

    test('returns year key within scheme key', async () => {
      const result = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(Object.keys(result.scheme)).toContain('year')
    })

    test('returns year as string', async () => {
      const result = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(result.scheme.year).toEqual(expect.any(String))
    })

    test('returns year as statement.scheme.year', async () => {
      const result = await getStatement(schedule.settlementId, schedule.scheduleId)
      expect(result.scheme.year).toEqual(statement.scheme.year)
    })
  })

  describe('when settlement is not connected to a payment request', () => {
    beforeEach(async () => {
      await db.settlement.update({ paymentRequestId: null }, { where: { paymentRequestId: paymentRequestIdCompleted } })
    })

    test('should update paymentRequestId', async () => {
      const settlementBefore = await db.settlement.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })

      await getStatement(schedule.settlementId, schedule.scheduleId)

      const settlementAfter = await db.settlement.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })
      expect(settlementBefore.paymentRequestId).toBeNull()
      expect(settlementAfter.paymentRequestId).not.toBeNull()
    })

    test('should update paymentRequestId to paymentRequestIdCompleted', async () => {
      await getStatement(schedule.settlementId, schedule.scheduleId)

      const settlementAfter = await db.settlement.findOne({ where: { invoiceNumber: settlement.invoiceNumber } })
      expect(settlementAfter.paymentRequestId).toBe(paymentRequestIdCompleted)
    })
  })
})
