const db = require('../../../../../app/data')

const getTotalByCalculationId = require('../../../../../app/processing/sfi-23-quarterly-statement/total/get-total-by-calculation-id')

const calculationIdOne = 11235452
const calculationIdTwo = 76726627

let retrievedTotal

describe('process get calculation object', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    const organisation = structuredClone(require('../../../../mock-objects/mock-organisation'))
    const total = structuredClone(require('../../../../mock-objects/mock-total'))

    const totals = [
      { ...total, calculationId: calculationIdOne, claimId: total.claimReference },
      { ...total, calculationId: calculationIdTwo, claimId: total.claimReference }
    ]
    retrievedTotal = {
      agreementEnd: new Date('2022-01-01T00:00:00.000Z'),
      agreementNumber: 123456789,
      agreementStart: new Date('2022-12-31T00:00:00.000Z'),
      calculationDate: new Date('2022-01-27T00:00:00.000Z'),
      calculationReference: 11235452,
      claimReference: 123456789,
      invoiceNumber: 'INVOICE123456',
      sbi: 105321000,
      schemeCode: 'SFIA',
      totalActionPayments: '1234.56',
      totalAdditionalPayments: '1234.56',
      totalPayments: '9987.65'
    }

    await db.organisation.create(organisation)
    await db.total.bulkCreate(totals)
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

  test('Should return total object when there is corresponding total with provided calculationId', async () => {
    const result = await getTotalByCalculationId(calculationIdOne)
    expect(result).toStrictEqual(retrievedTotal)
  })
})
