const db = require('../../../../app/data')
const moment = require('moment')
const { getSettlement } = require('../../../../app/processing/settlement')
const { ONE_HUNDRED_POUNDS, TWO_HUNDRED_POUNDS, ONE_THOUSAND_POUNDS } = require('../../../mock-components/mock-value')
const { DATE: SETTLEMENT_DATE } = require('../../../mock-components/mock-dates').SETTLEMENT

const SETTLEMENT_ID_NOT_SETTLED = 1
const SETTLEMENT_ID_SETTLED = 2

let settlement
let mappedSettlement

describe('process settlement', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    const schemes = JSON.parse(JSON.stringify(require('../../../../app/constants/schemes')))
    const {
      SFI_FIRST_PAYMENT: invoiceNumber,
      SFI_FIRST_PAYMENT_ORIGINAL: originalInvoiceNumber
    } = JSON.parse(JSON.stringify(require('../../../mock-components/mock-invoice-number')))
    const paymentRequest = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-payment-request').submitPaymentRequest))
    settlement = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-settlement')))
    settlement.settlementDate = SETTLEMENT_DATE

    await db.scheme.bulkCreate(schemes)
    await db.invoiceNumber.create({ invoiceNumber, originalInvoiceNumber })
    await db.paymentRequest.create(paymentRequest)
    await db.settlement.create({ ...settlement, paymentRequestId: 1, settled: false })

    mappedSettlement = {
      invoiceNumber: settlement.invoiceNumber,
      paymentRequestId: 1,
      reference: settlement.reference,
      settled: settlement.settled,
      settlementDate: new Date(settlement.settlementDate),
      value: settlement.value,
      paymentValue: settlement.paymentValue,
      lastSettlementValue: settlement.lastSettlementValue
    }
  })

  afterEach(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  afterAll(async () => {
    await db.sequelize.close()
  })

  test('should return mapped settled object when existing settled settlement with required information exists', async () => {
    await db.settlement.create({ ...settlement, paymentRequestId: 1 })
    const result = await getSettlement(SETTLEMENT_ID_SETTLED)
    expect(result).toStrictEqual(mappedSettlement)
  })

  test('should return paymentValue as settlement value if no previous settlements', async () => {
    await db.settlement.create(settlement)
    const result = await getSettlement(SETTLEMENT_ID_SETTLED)
    expect(result.paymentValue).toBe(settlement.value)
  })

  test('should return lastSettlementValue as 0 if no previous settlements', async () => {
    await db.settlement.create(settlement)
    const result = await getSettlement(SETTLEMENT_ID_SETTLED)
    expect(result.lastSettlementValue).toBe(0)
  })

  test('should return paymentValue as settlement value if previous settlements same date and value', async () => {
    await db.settlement.create(settlement)
    settlement.settlementDate = moment(settlement.settlementDate).subtract(1, 'day')
    await db.settlement.create(settlement)
    const result = await getSettlement(SETTLEMENT_ID_SETTLED)
    expect(result.paymentValue).toBe(settlement.value)
  })

  test('should return lastSettlementValue as 0 if previous settlements same date and value', async () => {
    await db.settlement.create(settlement)
    await db.settlement.create(settlement)
    const result = await getSettlement(SETTLEMENT_ID_SETTLED)
    expect(result.lastSettlementValue).toBe(0)
  })

  test('should return paymentValue as settlement value if previous settlement has higher value', async () => {
    await db.settlement.create(settlement)
    settlement.settlementDate = moment(settlement.settlementDate).subtract(1, 'day')
    await db.settlement.create({ ...settlement, value: ONE_THOUSAND_POUNDS })
    const result = await getSettlement(SETTLEMENT_ID_SETTLED)
    expect(result.paymentValue).toBe(settlement.value)
  })

  test('should return lastSettlementValue as 0 if previous settlement has higher value', async () => {
    await db.settlement.create(settlement)
    settlement.settlementDate = moment(settlement.settlementDate).subtract(1, 'day')
    await db.settlement.create({ ...settlement, value: ONE_THOUSAND_POUNDS })
    const result = await getSettlement(SETTLEMENT_ID_SETTLED)
    expect(result.lastSettlementValue).toBe(0)
  })

  test('should return paymentValue as settlement value if previous settlement unsettled', async () => {
    await db.settlement.create(settlement)
    settlement.settlementDate = moment(settlement.settlementDate).subtract(1, 'day')
    await db.settlement.create({ ...settlement, settled: false })
    const result = await getSettlement(SETTLEMENT_ID_SETTLED)
    expect(result.paymentValue).toBe(settlement.value)
  })

  test('should return lastSettlementValue as 0 if previous settlement unsettled', async () => {
    await db.settlement.create(settlement)
    settlement.settlementDate = moment(settlement.settlementDate).subtract(1, 'day')
    await db.settlement.create({ ...settlement, settled: false })
    const result = await getSettlement(SETTLEMENT_ID_SETTLED)
    expect(result.lastSettlementValue).toBe(0)
  })

  test('should return paymentValue subtracting previous settlement', async () => {
    await db.settlement.create(settlement)
    settlement.settlementDate = moment(settlement.settlementDate).subtract(1, 'day')
    await db.settlement.create({ ...settlement, value: ONE_HUNDRED_POUNDS })
    const result = await getSettlement(SETTLEMENT_ID_SETTLED)
    expect(result.paymentValue).toBe(settlement.value - ONE_HUNDRED_POUNDS)
  })

  test('should return lastSettlementValue as previous settlement value', async () => {
    await db.settlement.create(settlement)
    settlement.settlementDate = moment(settlement.settlementDate).subtract(1, 'day')
    await db.settlement.create({ ...settlement, value: ONE_HUNDRED_POUNDS })
    const result = await getSettlement(SETTLEMENT_ID_SETTLED)
    expect(result.lastSettlementValue).toBe(ONE_HUNDRED_POUNDS)
  })

  test('should return paymentValue subtracting latest previous settlement if multiple previous settlements', async () => {
    await db.settlement.create(settlement)
    settlement.settlementDate = moment(settlement.settlementDate).subtract(2, 'day')
    await db.settlement.create({ ...settlement, value: ONE_HUNDRED_POUNDS })
    settlement.settlementDate = settlement.settlementDate.add(1, 'day')
    await db.settlement.create({ ...settlement, value: TWO_HUNDRED_POUNDS })
    const result = await getSettlement(SETTLEMENT_ID_SETTLED)
    expect(result.paymentValue).toBe(settlement.value - TWO_HUNDRED_POUNDS)
  })

  test('should return lastSettlementValue as latest previous settlement value if multiple previous settlements', async () => {
    await db.settlement.create(settlement)
    settlement.settlementDate = moment(settlement.settlementDate).subtract(2, 'day')
    await db.settlement.create({ ...settlement, value: ONE_HUNDRED_POUNDS })
    settlement.settlementDate = settlement.settlementDate.add(1, 'day')
    await db.settlement.create({ ...settlement, value: TWO_HUNDRED_POUNDS })
    const result = await getSettlement(SETTLEMENT_ID_SETTLED)
    expect(result.lastSettlementValue).toBe(TWO_HUNDRED_POUNDS)
  })

  test('should throw when no existing settlement exists', async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })

    const wrapper = async () => { await getSettlement(1) }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw when no existing settlement exists', async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })

    const wrapper = async () => { await getSettlement(undefined) }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw when no existing settlement exists', async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })

    const wrapper = async () => { await getSettlement(null) }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw when existing unsettled settlement with required information exists', async () => {
    const wrapper = async () => { await getSettlement(SETTLEMENT_ID_NOT_SETTLED) }
    expect(wrapper).rejects.toThrow()
  })

  test('should throw when existing settled settlement with missing required reference does not exist', async () => {
    delete settlement.reference
    await db.settlement.create({ ...settlement, paymentRequestId: 1 })

    const wrapper = async () => { await getSettlement(SETTLEMENT_ID_SETTLED) }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw when existing settled settlement with missing required settled does not exist', async () => {
    delete settlement.settled
    await db.settlement.create({ ...settlement, paymentRequestId: 1 })

    const wrapper = async () => { await getSettlement(SETTLEMENT_ID_SETTLED) }

    expect(wrapper).rejects.toThrow()
  })
})
