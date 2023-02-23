const removePrefix = require('../../../../app/processing/invoice-line/remove-description-prefix')

describe('remove description prefix', () => {
  test('should remove prefix from description', () => {
    const description = 'P02 - Over declaration reduction'
    const result = removePrefix(description)
    expect(result).toBe('Over declaration reduction')
  })

  test('should not remove prefix from description if it does not exist', () => {
    const description = 'Over declaration reduction'
    const result = removePrefix(description)
    expect(result).toBe('Over declaration reduction')
  })
})
