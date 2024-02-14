const { IMMEDIATE, QUARTERLY } = require('../../../app/constants/payment-type')

describe('payment type values', () => {
  test('IMMEDIATE must always return Immediate payment', () => {
    const immediate = IMMEDIATE
    expect(immediate).toStrictEqual('Immediate payment')
  })

  test('QUARTERLY must always return Quarterly payment', () => {
    const quarterly = QUARTERLY
    expect(quarterly).toStrictEqual('Quarterly payment')
  })
})
