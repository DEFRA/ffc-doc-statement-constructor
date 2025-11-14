const d365DB = (sequelize, DataTypes) => {
  const paymentReferenceChars = 30
  const paymentPeriodLength = 200
  const marketingYearMin = 2023
  const marketingYearMax = 2050
  const d365 = sequelize.define('d365', {
    paymentReference: { type: DataTypes.STRING(paymentReferenceChars), primaryKey: true, allowNull: false, unique: true, comment: 'Example Output: PY1234567 Source: DWH | D365 Used on Statement? Yes. Displayed in the Payment Summary section, and used on remittance and bank statements' },
    calculationId: { type: DataTypes.INTEGER, allowNull: true, comment: 'Example Output: 987654321 Source: DWH | D365 Used on Statement? No. ID of calculation details and used to join data.' },
    paymentPeriod: { type: DataTypes.STRING(paymentPeriodLength), allowNull: true, comment: 'Example Output: Q4-24 Source: DWH | D365 Used on Statement? No, but could be used for schedules in the future' },
    marketingYear: { type: DataTypes.INTEGER(), allowNull: false, validate: { isInt: true, min: marketingYearMin, max: marketingYearMax, comment: 'Example Output: 2024 Source: DWH | D365 Used on Statement? Yes. Used in the statement heading to show the marketing year of payment' } },
    paymentAmount: { type: DataTypes.NUMERIC, allowNull: false, comment: 'Example Output: 1000.00 Source: DWH | D365 Used on Statement? Yes, used in the Payment Summary to show how much the user has been paid' },
    transactionDate: { type: DataTypes.DATE, allowNull: false, comment: 'Example Output: 2024-01-31 Source: DWH | D365 Used on Statement? Yes, in the Payment Summary and opening details. This is the date of the payment' },
    datePublished: { type: DataTypes.DATE, allowNull: true, comment: 'Example Output: 2024-02-09 00:00:00 Source: DWH |D365 Used on Statement? No, used for logic to detemine when statements were published' },
    startPublish: { type: DataTypes.DATE, allowNull: true, comment: 'Example Output: 2024-02-09 00:00:00 Source: DWH |D365 Used on Statement? No, used for logic to detemine when statements were published' },
    completePublish: { type: DataTypes.DATE, allowNull: true, comment: 'Example Output: 2024-02-09 00:00:00 Source: DWH |D365 Used on Statement? No, used for logic to detemine when statement publishing was completed' },
    lastProcessAttempt: { type: DataTypes.DATE, allowNull: true, comment: 'Example Output: 2024-02-09 00:00:00 Source: DWH |D365 Used on Statement? No, used for logic to detemine last time that a publish was attempted' }
  },
  {
    tableName: 'd365',
    freezeTableName: true,
    timestamps: false
  })

  d365.associate = function (models) {
    d365.belongsTo(models.delinkedCalculation, {
      foreignKey: 'calculationId',
      as: 'delinkedCalculation'
    })
  }

  return d365
}

module.exports = d365DB
