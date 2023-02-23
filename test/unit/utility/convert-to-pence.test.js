const { convertToPence } = require('../../../app/utility')

describe('convert decimal pounds to pence', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return 1256 when 12.56 is given', async () => {
    const result = await convertToPence(12.56)
    expect(result).toBe(1256)
  })
})
