const { convertToPounds } = require('../../../app/utility')

describe('convertToPounds', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test.each([
    [56789, '567.89'],
    [0, '0.00'],
    [1, '0.01'],
    [10, '0.10'],
    [100, '1.00'],
    [101, '1.01'],
    [110, '1.10'],
    [111, '1.11'],
    [1000, '10.00'],
    [1001, '10.01'],
    [1010, '10.10'],
    [1011, '10.11'],
    [1100, '11.00'],
    [1101.1, '11.02'],
    [1101.5, '11.02'],
    [1101.9, '11.02'],
    [undefined, '0.00'],
    [null, '0.00']
  ])('should return "%s" when %s is given', async (input, expected) => {
    const result = await convertToPounds(input)
    expect(result).toBe(expected)
  })
})
