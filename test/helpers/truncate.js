const db = require('../../app/data')

const tables = [
  'actions',
  'd365',
  'dax',
  'delinkedCalculation',
  'documents',
  'documentTypes',
  'excludedPaymentReferences',
  'organisations',
  'schemes',
  'totals'
]

const truncate = async () => {
  const quoted = tables.map(table => `"${table}"`).join(', ')
  await db.client.raw(`TRUNCATE TABLE ${quoted} RESTART IDENTITY CASCADE`)
}

module.exports = {
  truncate
}
