const db = require('../../../app/data')
const { convertToPounds } = require('../../../app/utility')

const { mockMessageSender } = require('../../mock-modules/ffc-messaging')

jest.mock('../../../app/processing/payment-schedule/get-payment-schedule')
const getPaymentSchedule = require('../../../app/processing/payment-schedule/get-payment-schedule')

const processPaymentSchedules = require('../../../app/processing/process-payment-schedules')

let schedule

describe('process payment schedules', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    const { DATE } = require('../../mock-components/mock-dates').UPDATED
    jest.useFakeTimers().setSystemTime(DATE)

    const schemes = JSON.parse(JSON.stringify(require('../../../app/constants/schemes')))
    const {
      SFI_FIRST_PAYMENT: invoiceNumber,
      SFI_FIRST_PAYMENT_ORIGINAL: originalInvoiceNumber
    } = JSON.parse(JSON.stringify(require('../../mock-components/mock-invoice-number')))

    schedule = JSON.parse(JSON.stringify(require('../../mock-objects/mock-payment-schedule')))

    const PAYMENT_REQUEST = require('../../mock-objects/mock-payment-request').submitPaymentRequest
    const { SCHEDULE } = require('../../mock-objects/mock-schedule')

    await db.scheme.bulkCreate(schemes)
    await db.invoiceNumber.create({ invoiceNumber, originalInvoiceNumber })
    await db.paymentRequest.create(PAYMENT_REQUEST)
    await db.schedule.create(SCHEDULE)

    getPaymentSchedule.mockResolvedValue(schedule)
  })

  afterEach(async () => {
    jest.clearAllMocks()

    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  describe('when valid payment schedule', () => {
    test('should update started for schedule', async () => {
      const scheduleBefore = await db.schedule.findOne({ where: { scheduleId: 1 }, raw: true })

      await processPaymentSchedules()

      const scheduleAfter = await db.schedule.findOne({ where: { scheduleId: 1 }, raw: true })
      expect(scheduleBefore.started).toBeNull()
      expect(scheduleAfter.started).toBeDefined()
    })

    test('should update started to date now', async () => {
      await processPaymentSchedules()

      const schedule = await db.schedule.findOne({ where: { scheduleId: 1 }, raw: true })
      expect(schedule.started).toStrictEqual(new Date())
    })

    test('should call mockMessageSender().sendMessage', async () => {
      await processPaymentSchedules()
      expect(mockMessageSender().sendMessage).toHaveBeenCalled()
    })

    test('should call mockMessageSender().sendMessage once', async () => {
      await processPaymentSchedules()
      expect(mockMessageSender().sendMessage).toHaveBeenCalledTimes(1)
    })

    test('should update completed for schedule', async () => {
      const scheduleBefore = await db.schedule.findOne({ where: { scheduleId: 1 }, raw: true })

      await processPaymentSchedules()

      const scheduleAfter = await db.schedule.findOne({ where: { scheduleId: 1 }, raw: true })
      expect(scheduleBefore.completed).toBeNull()
      expect(scheduleAfter.completed).toBeDefined()
    })

    test('should update completed for schedule to date now', async () => {
      await processPaymentSchedules()

      const schedule = await db.schedule.findOne({ where: { scheduleId: 1 }, raw: true })
      expect(schedule.completed).toStrictEqual(new Date())
    })
  })

  describe('when invalid payment schedule', () => {
    beforeEach(async () => {
      getPaymentSchedule.mockResolvedValue({ ...schedule, adjustment: { ...schedule.adjustment, adjustmentValue: convertToPounds(0) } })
    })

    test('should not call mockMessageSender().sendMessage', async () => {
      await processPaymentSchedules()
      expect(mockMessageSender().sendMessage).not.toHaveBeenCalled()
    })

    test('should update completed for schedule', async () => {
      const scheduleBefore = await db.schedule.findOne({ where: { scheduleId: 1 }, raw: true })

      await processPaymentSchedules()

      const scheduleAfter = await db.schedule.findOne({ where: { scheduleId: 1 }, raw: true })
      expect(scheduleBefore.completed).toBeNull()
      expect(scheduleAfter.completed).toBeDefined()
    })

    test('should update completed for schedule to date now', async () => {
      await processPaymentSchedules()

      const schedule = await db.schedule.findOne({ where: { scheduleId: 1 }, raw: true })
      expect(schedule.completed).toStrictEqual(new Date())
    })
  })
})
