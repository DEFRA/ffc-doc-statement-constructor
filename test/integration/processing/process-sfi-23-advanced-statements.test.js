const db = require('../../../app/data')

const { mockMessageSender } = require('../../mock-modules/ffc-messaging')

jest.mock('../../../app/processing/sfi-23-advanced-statement/get-sfi-23-advanced-statement')
const getSfi23AdvancedStatement = require('../../../app/processing/sfi-23-advanced-statement/get-sfi-23-advanced-statement')

const processSfi23AdvancedStatements = require('../../../app/processing/process-sfi-23-advanced-statements')

let sfi23AdvancedStatement

describe('process sfi-23 advanced statements', () => {
  beforeEach(async () => {
    const { DATE } = require('../../mock-components/mock-dates').UPDATED
    jest.useFakeTimers().setSystemTime(DATE)

    sfi23AdvancedStatement = JSON.parse(JSON.stringify(require('../../mock-objects/mock-sfi-23-advanced-statement')))

    const SETTLEMENT = require('../../mock-objects/mock-settlement')
    const { SFI23ADVANCEDSTATEMENT } = require('../../mock-objects/mock-schedule')

    await db.settlement.create(SETTLEMENT)
    await db.schedule.create(SFI23ADVANCEDSTATEMENT)

    getSfi23AdvancedStatement.mockResolvedValue(sfi23AdvancedStatement)
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

      await processSfi23AdvancedStatements()

      const scheduleAfter = await db.schedule.findOne({ where: { scheduleId: 1 }, raw: true })
      expect(scheduleBefore.started).toBeNull()
      expect(scheduleAfter.started).toBeDefined()
    })

    test('should update started to date now', async () => {
      await processSfi23AdvancedStatements()

      const schedule = await db.schedule.findOne({ where: { scheduleId: 1 }, raw: true })
      expect(schedule.started).toStrictEqual(new Date())
    })

    test('should call mockMessageSender().sendMessage', async () => {
      await processSfi23AdvancedStatements()
      expect(mockMessageSender().sendMessage).toHaveBeenCalled()
    })

    test('should call mockMessageSender().sendMessage once', async () => {
      await processSfi23AdvancedStatements()
      expect(mockMessageSender().sendMessage).toHaveBeenCalledTimes(1)
    })

    test('should update completed for schedule', async () => {
      const scheduleBefore = await db.schedule.findOne({ where: { scheduleId: 1 }, raw: true })

      await processSfi23AdvancedStatements()

      const scheduleAfter = await db.schedule.findOne({ where: { scheduleId: 1 }, raw: true })
      expect(scheduleBefore.completed).toBeNull()
      expect(scheduleAfter.completed).toBeDefined()
    })

    test('should update completed for schedule to date now', async () => {
      await processSfi23AdvancedStatements()

      const schedule = await db.schedule.findOne({ where: { scheduleId: 1 }, raw: true })
      expect(schedule.completed).toStrictEqual(new Date())
    })
  })

  describe('when invalid sfi23AdvancedStatement', () => {
    beforeEach(async () => {
      getSfi23AdvancedStatement.mockResolvedValue({ ...sfi23AdvancedStatement, payments: [{ ...sfi23AdvancedStatement.payments[0], value: 0 }] })
    })

    test('should not call mockMessageSender().sendMessage', async () => {
      await processSfi23AdvancedStatements()
      expect(mockMessageSender().sendMessage).not.toHaveBeenCalled()
    })

    test('should update completed for schedule', async () => {
      const scheduleBefore = await db.schedule.findOne({ where: { scheduleId: 1 }, raw: true })

      await processSfi23AdvancedStatements()

      const scheduleAfter = await db.schedule.findOne({ where: { scheduleId: 1 }, raw: true })
      expect(scheduleBefore.completed).toBeNull()
      expect(scheduleAfter.completed).toBeDefined()
    })

    test('should update completed for schedule to date now', async () => {
      await processSfi23AdvancedStatements()

      const schedule = await db.schedule.findOne({ where: { scheduleId: 1 }, raw: true })
      expect(schedule.completed).toStrictEqual(new Date())
    })
  })
})
