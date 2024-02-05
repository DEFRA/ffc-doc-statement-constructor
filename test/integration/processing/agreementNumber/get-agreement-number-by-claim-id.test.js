const db = require('../../../../app/data')
let claimAgreementNumber

const getAgreementNumberByClaimId = require('../../../../app/processing/agreementNumber/get-agreement-number-by-claim-id')

describe('process get agreement number by claim id object', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    claimAgreementNumber = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-claim-agreement')))
    await db.claimAgreement.bulkCreate(claimAgreementNumber)
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

  test('should return record with corresponding agreement number when claimId exists', async () => {
    const result = await getAgreementNumberByClaimId(claimAgreementNumber[0].claimId)
    expect(result.agreementNumber).toBe(claimAgreementNumber[0].agreementNumber)
  })
})
