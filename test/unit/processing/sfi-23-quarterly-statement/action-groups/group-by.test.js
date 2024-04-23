const groupBy = require('../../../../../app/processing/sfi-23-quarterly-statement/action-groups/group-by')

test('should group array elements by property', () => {
  const arr = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    { id: 3, name: 'John' },
    { id: 4, name: 'Jane' }
  ]
  const result = groupBy(arr, 'name')
  expect(result).toEqual({
    John: [
      { id: 1, name: 'John' },
      { id: 3, name: 'John' }
    ],
    Jane: [
      { id: 2, name: 'Jane' },
      { id: 4, name: 'Jane' }
    ]
  })
})

test('should group array elements by property when property values are numbers', () => {
  const arr = [
    { id: 1, age: 25 },
    { id: 2, age: 30 },
    { id: 3, age: 25 },
    { id: 4, age: 30 }
  ]
  const result = groupBy(arr, 'age')
  expect(result).toEqual({
    25: [
      { id: 1, age: 25 },
      { id: 3, age: 25 }
    ],
    30: [
      { id: 2, age: 30 },
      { id: 4, age: 30 }
    ]
  })
})

test('should group array elements by property when property values are boolean', () => {
  const arr = [
    { id: 1, active: true },
    { id: 2, active: false },
    { id: 3, active: true },
    { id: 4, active: false }
  ]
  const result = groupBy(arr, 'active')
  expect(result).toEqual({
    true: [
      { id: 1, active: true },
      { id: 3, active: true }
    ],
    false: [
      { id: 2, active: false },
      { id: 4, active: false }
    ]
  })
})

test('should return an empty object when array is empty', () => {
  const arr = []
  const result = groupBy(arr, 'name')
  expect(result).toEqual({})
})
