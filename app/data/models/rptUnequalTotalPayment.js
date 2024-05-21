module.exports = (sequelize, DataTypes) => {
  const number30 = 30
  const number200 = 200
  const number450 = 450
  const dax = sequelize.define('rptUnequalTotalPayment', {
    paymentReference: { type: DataTypes.STRING(number30), primaryKey: true, allowNull: false },
    calculationId: { type: DataTypes.INTEGER },
    paymentPeriod: { type: DataTypes.STRING(number200), allowNull: true },
    expectedQuarterlyPayment: { type: DataTypes.NUMERIC, allowNull: false },
    actualQuarterlyPayment: { type: DataTypes.NUMERIC, allowNull: false },
    transactionDate: { type: DataTypes.DATE, allowNull: false },
    sbi: { type: DataTypes.INTEGER },
    frn: { type: DataTypes.BIGINT },
    schemeName: { type: DataTypes.STRING(number450) },
    reportGenerated: { type: DataTypes.DATE, allowNull: true }
  },
  {
    tableName: 'rptUnequalTotalPayment',
    freezeTableName: true,
    timestamps: false
  })
  return dax
}
