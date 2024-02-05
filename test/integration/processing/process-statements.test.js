const db = require('../../../app/data')

const { mockMessageSender } = require('../../mock-modules/ffc-messaging')

jest.mock('../../../app/processing/statement/get-statement')
const getStatement = require('../../../app/processing/statement/get-statement')

const processStatements = require('../../../app/processing/process-statements')

let statement

describe('process statements', () => {
  beforeEach(async () => {
    const { DATE } = require('../../mock-components/mock-dates').UPDATED
    jest.useFakeTimers().setSystemTime(DATE)

    statement = JSON.parse(JSON.stringify(require('../../mock-objects/mock-statement')))

    const SETTLEMENT = require('../../mock-objects/mock-settlement')
    const { STATEMENT } = require('../../mock-objects/mock-schedule')

    await db.settlement.create(SETTLEMENT)
    await db.schedule.create(STATEMENT)

    getStatement.mockResolvedValue(statement)
  })

  afterEach(async () => {
    jest.clearAllMocks()

    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  describe('when valid statement', () => {
    test('should update started for schedule', async () => {
      const scheduleBefore = await db.schedule.findOne({ where: { scheduleId: 1 }, raw: true })

      await processStatements()

      const scheduleAfter = await db.schedule.findOne({ where: { scheduleId: 1 }, raw: true })
      expect(scheduleBefore.started).toBeNull()
      expect(scheduleAfter.started).toBeDefined()
    })

    test('should update started to date now', async () => {
      await processStatements()

      const schedule = await db.schedule.findOne({ where: { scheduleId: 1 }, raw: true })
      expect(schedule.started).toStrictEqual(new Date())
    })

    test('should call mockMessageSender().sendMessage', async () => {
      await processStatements()
      expect(mockMessageSender().sendMessage).toHaveBeenCalled()
    })

    test('should call mockMessageSender().sendMessage once', async () => {
      await processStatements()
      expect(mockMessageSender().sendMessage).toHaveBeenCalledTimes(1)
    })

    test('should update completed for schedule', async () => {
      const scheduleBefore = await db.schedule.findOne({ where: { scheduleId: 1 }, raw: true })

      await processStatements()

      const scheduleAfter = await db.schedule.findOne({ where: { scheduleId: 1 }, raw: true })
      expect(scheduleBefore.completed).toBeNull()
      expect(scheduleAfter.completed).toBeDefined()
    })

    test('should update completed for schedule to date now', async () => {
      await processStatements()

      const schedule = await db.schedule.findOne({ where: { scheduleId: 1 }, raw: true })
      expect(schedule.completed).toStrictEqual(new Date())
    })
  })

  describe('when invalid statement', () => {
    beforeEach(async () => {
      getStatement.mockResolvedValue({ ...statement, payments: [{ ...statement.payments[0], value: 0 }] })
    })

    test('should not call mockMessageSender().sendMessage', async () => {
      await processStatements()
      expect(mockMessageSender().sendMessage).not.toHaveBeenCalled()
    })

    test('should update completed for schedule', async () => {
      const scheduleBefore = await db.schedule.findOne({ where: { scheduleId: 1 }, raw: true })

      await processStatements()

      const scheduleAfter = await db.schedule.findOne({ where: { scheduleId: 1 }, raw: true })
      expect(scheduleBefore.completed).toBeNull()
      expect(scheduleAfter.completed).toBeDefined()
    })

    test('should update completed for schedule to date now', async () => {
      await processStatements()

      const schedule = await db.schedule.findOne({ where: { scheduleId: 1 }, raw: true })
      expect(schedule.completed).toStrictEqual(new Date())
    })
  })
})
