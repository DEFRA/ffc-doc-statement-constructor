const moment = require('moment')

module.exports = [{
  dueDate: moment('2021-01-01'),
  outstanding: false,
  period: 'Sep-Dec 2020',
  value: 25000
}, {
  dueDate: moment('2021-04-01'),
  outstanding: true,
  period: 'Jan-Mar 2021',
  value: 25000
}, {
  dueDate: moment('2021-07-01'),
  outstanding: true,
  period: 'Apr-Jun 2021',
  value: 25000
}, {
  dueDate: moment('2021-10-01'),
  outstanding: true,
  period: 'Jul-Sep 2021',
  value: 25000
}]
