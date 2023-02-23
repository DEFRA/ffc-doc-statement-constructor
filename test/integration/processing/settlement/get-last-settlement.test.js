const moment = require('moment')

const db = require('../../../../app/data')

const getLastSettlement = require('../../../../app/processing/settlement/get-last-settlement')
const { DATE: SETTLEMENT_DATE } = require('../../../mock-components/mock-dates').SETTLEMENT

let currentSettlement
let previousSettlement
let settlementDate
let value
let invoiceNumber

describe('process settlement', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    currentSettlement = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-settlement')))
    currentSettlement.settlementDate = SETTLEMENT_DATE
    previousSettlement = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-settlement')))
    previousSettlement.settlementDate = moment(currentSettlement.settlementDate).subtract(1, 'day')
    settlementDate = currentSettlement.settlementDate
    value = currentSettlement.value
    invoiceNumber = currentSettlement.invoiceNumber
    await db.settlement.create(currentSettlement)
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

  test('should return null if no previous settlements', async () => {
    const lastSettlement = await getLastSettlement(settlementDate, value, invoiceNumber)
    expect(lastSettlement).toBeNull()
  })

  test('should return null if previous settlements same date and value', async () => {
    await db.settlement.create(previousSettlement)
    const lastSettlement = await getLastSettlement(settlementDate, value, invoiceNumber)
    expect(lastSettlement).toBeNull()
  })

  test('should return null if previous settlements same date', async () => {
    previousSettlement.settlementDate = currentSettlement.settlementDate
    previousSettlement.value = 40000
    await db.settlement.create(previousSettlement)
    const lastSettlement = await getLastSettlement(settlementDate, value, invoiceNumber)
    expect(lastSettlement).toBeNull()
  })

  test('should return null if previous settlements same value and earlier date', async () => {
    await db.settlement.create(previousSettlement)
    const lastSettlement = await getLastSettlement(settlementDate, value, invoiceNumber)
    expect(lastSettlement).toBeNull()
  })

  test('should return null if previous settlements lower value and later date', async () => {
    previousSettlement.settlementDate = moment(currentSettlement.settlementDate).add(1, 'day')
    previousSettlement.value = 40000
    await db.settlement.create(previousSettlement)
    const lastSettlement = await getLastSettlement(settlementDate, value, invoiceNumber)
    expect(lastSettlement).toBeNull()
  })

  test('should return null if previous settlements unsettled', async () => {
    previousSettlement.value = 40000
    previousSettlement.settled = false
    await db.settlement.create(previousSettlement)
    const lastSettlement = await getLastSettlement(settlementDate, value, invoiceNumber)
    expect(lastSettlement).toBeNull()
  })

  test('should return settlement if previous settlements lower value and earlier date', async () => {
    previousSettlement.value = 40000
    await db.settlement.create(previousSettlement)
    const lastSettlement = await getLastSettlement(settlementDate, value, invoiceNumber)
    expect(lastSettlement.value).toBe(previousSettlement.value)
  })

  test('should return latest settlement if multiple previous settlements', async () => {
    previousSettlement.value = 40000
    await db.settlement.create(previousSettlement)
    previousSettlement.settlementDate = moment(currentSettlement.settlementDate).subtract(2, 'day')
    previousSettlement.value = 30000
    await db.settlement.create(previousSettlement)
    const lastSettlement = await getLastSettlement(settlementDate, value, invoiceNumber)
    expect(lastSettlement.value).toBe(40000)
  })

  test('should return latest lower settlement if multiple previous settlements', async () => {
    await db.settlement.create(previousSettlement)
    previousSettlement.settlementDate = moment(currentSettlement.settlementDate).subtract(2, 'day')
    previousSettlement.value = 30000
    await db.settlement.create(previousSettlement)
    const lastSettlement = await getLastSettlement(settlementDate, value, invoiceNumber)
    expect(lastSettlement.value).toBe(30000)
  })

  test('should return settlement if previous settlements lower value and earlier date if negative values', async () => {
    value = -50000
    previousSettlement.value = -40000
    await db.settlement.create(previousSettlement)
    const lastSettlement = await getLastSettlement(settlementDate, value, invoiceNumber)
    expect(lastSettlement.value).toBe(previousSettlement.value)
  })

  test('should return latest settlement if multiple previous settlements if negative values', async () => {
    value = -50000
    previousSettlement.value = -40000
    await db.settlement.create(previousSettlement)
    previousSettlement.settlementDate = moment(currentSettlement.settlementDate).subtract(2, 'day')
    previousSettlement.value = -30000
    await db.settlement.create(previousSettlement)
    const lastSettlement = await getLastSettlement(settlementDate, value, invoiceNumber)
    expect(lastSettlement.value).toBe(-40000)
  })
})
