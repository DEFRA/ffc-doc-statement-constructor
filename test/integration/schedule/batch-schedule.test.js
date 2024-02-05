jest.useFakeTimers().setSystemTime(new Date(2022, 7, 5, 12, 0, 0, 0))

const moment = require('moment')

const db = require('../../../app/data')
const config = require('../../../app/config').processingConfig

const { schedulePendingSettlements } = require('../../../app/processing/schedule')

const LESS_TIME_THAN_ELAPSED_MAX = moment(new Date()).subtract(config.scheduleProcessingMaxElapsedTime - 500).toDate()
const MORE_TIME_THAN_ELAPSED_MAX = moment(new Date()).subtract(config.scheduleProcessingMaxElapsedTime + 500).toDate()

const LESS_TIME_THAN_WAIT_TIME = moment(new Date()).subtract(config.settlementWaitTime - 500).toDate()
const MORE_TIME_THAN_WAIT_TIME = moment(new Date()).subtract(config.settlementWaitTime + 500).toDate()

let settlement
let schedule

describe('batch schedule', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    const schemes = JSON.parse(JSON.stringify(require('../../../app/constants/schemes')))
    const {
      SFI_FIRST_PAYMENT: invoiceNumber,
      SFI_FIRST_PAYMENT_ORIGINAL: originalInvoiceNumber
    } = JSON.parse(JSON.stringify(require('../../mock-components/mock-invoice-number')))
    const paymentRequest = JSON.parse(JSON.stringify(require('../../mock-objects/mock-payment-request').submitPaymentRequest))
    settlement = JSON.parse(JSON.stringify(require('../../mock-objects/mock-settlement')))
    schedule = JSON.parse(JSON.stringify(require('../../mock-objects/mock-schedule').STATEMENT))

    await db.scheme.bulkCreate(schemes)
    await db.invoiceNumber.create({ invoiceNumber, originalInvoiceNumber })
    await db.paymentRequest.create(paymentRequest)
    await db.settlement.create({ ...settlement, paymentRequestId: 1 })
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

  test('should return mapped schedule array when existing schedule with null completed and null started exists', async () => {
    await db.schedule.create(schedule)

    const result = await schedulePendingSettlements()

    expect(result).toStrictEqual([{
      scheduleId: 1,
      settlementId: schedule.settlementId
    }])
  })

  test('should return empty array when no existing schedule exists', async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })

    const result = await schedulePendingSettlements()

    expect(result).toStrictEqual([])
  })

  test('should return mapped schedule array when existing schedule with null completed and started is MORE_TIME_THAN_ELAPSED_MAX exists', async () => {
    schedule.started = MORE_TIME_THAN_ELAPSED_MAX
    await db.schedule.create(schedule)

    const result = await schedulePendingSettlements()

    expect(result).toStrictEqual([{
      scheduleId: 1,
      settlementId: schedule.settlementId
    }])
  })

  test('should return empty array when existing schedule with null completed and started is LESS_TIME_THAN_ELAPSED_MAX exists', async () => {
    schedule.started = LESS_TIME_THAN_ELAPSED_MAX
    await db.schedule.create(schedule)

    const result = await schedulePendingSettlements()

    expect(result).toStrictEqual([])
  })

  test('should return empty array when existing schedule with not null completed and null started exists', async () => {
    schedule.completed = new Date()
    await db.schedule.create(schedule)

    const result = await schedulePendingSettlements()

    expect(result).toStrictEqual([])
  })

  test('should return empty array when existing schedule with not null completed and started is MORE_TIME_THAN_ELAPSED_MAX exists', async () => {
    schedule.started = MORE_TIME_THAN_ELAPSED_MAX
    schedule.completed = new Date()
    await db.schedule.create(schedule)

    const result = await schedulePendingSettlements()

    expect(result).toStrictEqual([])
  })

  test('should return empty array when existing schedule with not null completed and started is LESS_TIME_THAN_ELAPSED_MAX exists', async () => {
    schedule.started = LESS_TIME_THAN_ELAPSED_MAX
    schedule.completed = new Date()
    await db.schedule.create(schedule)

    const result = await schedulePendingSettlements()

    expect(result).toStrictEqual([])
  })

  test('should return mapped schedule array when settlement MORE_TIME_THAN_WAIT_TIME exists', async () => {
    await db.settlement.update({ received: MORE_TIME_THAN_WAIT_TIME }, { where: { paymentRequestId: 1 } })
    await db.schedule.create(schedule)

    const result = await schedulePendingSettlements()

    expect(result).toStrictEqual([{
      scheduleId: 1,
      settlementId: schedule.settlementId
    }])
  })

  test('should return empty array when settlement LESS_TIME_THAN_WAIT_TIME exists', async () => {
    await db.settlement.update({ received: LESS_TIME_THAN_WAIT_TIME }, { where: { paymentRequestId: 1 } })
    await db.schedule.create(schedule)

    const result = await schedulePendingSettlements()

    expect(result).toStrictEqual([])
  })

  test('should update started as new Date() when existing schedule with null completed and null started exists', async () => {
    await db.schedule.create(schedule)
    const startedTimeBefore = (await db.schedule.findOne({ where: { scheduleId: 1 } })).started

    await schedulePendingSettlements()

    const startedTimeAfter = (await db.schedule.findOne({ where: { scheduleId: 1 } })).started
    expect(startedTimeBefore).toBeNull()
    expect(startedTimeAfter).toStrictEqual(new Date())
  })

  test('should not update started when existing schedule with null completed and started is LESS_TIME_THAN_ELAPSED_MAX exists', async () => {
    schedule.started = LESS_TIME_THAN_ELAPSED_MAX
    await db.schedule.create(schedule)
    const startedTimeBefore = (await db.schedule.findOne({ where: { scheduleId: 1 } })).started

    await schedulePendingSettlements()

    const startedTimeAfter = (await db.schedule.findOne({ where: { scheduleId: 1 } })).started
    expect(startedTimeBefore).toStrictEqual(LESS_TIME_THAN_ELAPSED_MAX)
    expect(startedTimeAfter).toStrictEqual(LESS_TIME_THAN_ELAPSED_MAX)
  })

  test('should not update started when existing schedule with not null completed and null started exists', async () => {
    schedule.completed = new Date()
    await db.schedule.create(schedule)
    const startedTimeBefore = (await db.schedule.findOne({ where: { scheduleId: 1 } })).started

    await schedulePendingSettlements()

    const startedTimeAfter = (await db.schedule.findOne({ where: { scheduleId: 1 } })).started
    expect(startedTimeBefore).toBeNull()
    expect(startedTimeAfter).toBeNull()
  })

  test('should not update started when existing schedule with not null completed and started is MORE_TIME_THAN_ELAPSED_MAX exists', async () => {
    schedule.started = MORE_TIME_THAN_ELAPSED_MAX
    schedule.completed = new Date()
    await db.schedule.create(schedule)
    const startedTimeBefore = (await db.schedule.findOne({ where: { scheduleId: 1 } })).started

    await schedulePendingSettlements()

    const startedTimeAfter = (await db.schedule.findOne({ where: { scheduleId: 1 } })).started
    expect(startedTimeBefore).toStrictEqual(MORE_TIME_THAN_ELAPSED_MAX)
    expect(startedTimeAfter).toStrictEqual(MORE_TIME_THAN_ELAPSED_MAX)
  })

  test('should not update started when existing schedule with not null completed and started is LESS_TIME_THAN_ELAPSED_MAX exists', async () => {
    schedule.started = LESS_TIME_THAN_ELAPSED_MAX
    schedule.completed = new Date()
    await db.schedule.create(schedule)
    const startedTimeBefore = (await db.schedule.findOne({ where: { scheduleId: 1 } })).started

    await schedulePendingSettlements()

    const startedTimeAfter = (await db.schedule.findOne({ where: { scheduleId: 1 } })).started
    expect(startedTimeBefore).toStrictEqual(LESS_TIME_THAN_ELAPSED_MAX)
    expect(startedTimeAfter).toStrictEqual(LESS_TIME_THAN_ELAPSED_MAX)
  })
})
