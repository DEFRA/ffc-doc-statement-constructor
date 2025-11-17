const daxDB = (sequelize, DataTypes) => {
  const number30 = 30
  const number200 = 200
  const dax = sequelize.define('dax', {
    paymentReference: { type: DataTypes.STRING(number30), allowNull: false, comment: "Example Output: RC200820242 Source: DWH | DAX Used on Statement? Yes  Payment Summary. Reference used on remittance and user's bank statement." },
    calculationId: { type: DataTypes.INTEGER, comment: "Example Output: 120240820 Source: DWH | DAX Used on Statement? No, Required to join data. ID of calculation details and used to join data" },
    paymentPeriod: { type: DataTypes.STRING(number200), allowNull: true, comment: "Example Output: Q4-24 Source: DAX. Could be used for payment schedules Used on Statement? No, Retained as potentially useful for schedules in future" },
    paymentAmount: { type: DataTypes.NUMERIC, allowNull: false, comment: "Example Output: -500 they Source: DAX. Amount paid to the customer for this payment instalment Used on Statement? Yes, Payment Summary" },
    transactionDate: { type: DataTypes.DATE, allowNull: false, comment: "Example Output: 2024-02-09 00:00:00 Source: DAX. Date the payment was made to the customer Used on Statement? Yes, Payment Summary, Opening Details" },
    datePublished: { type: DataTypes.DATE, allowNull: true, comment: "Example Output: 2025-05-12 15:08:08.776 Source: Documents. Used to determine if a statement has been generated Used on Statement? No, Used for ETL Logic" },
    daxId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, comment: "Example Output: 1 Source: DAX. Used as a primary key in our database Used on Statement? No, Required as the primary key" },
    startPublish: { type: DataTypes.DATE, allowNull: true, comment: "Example Output: 2025-05-12 15:08:08.776 Source: Documents. Used to determine if a statement has been generated Used on Statement? No, Used for logic for determining if we've published data downstream" },
    completePublish: { type: DataTypes.DATE, allowNull: true, comment: "Example Output: 2025-05-12 15:08:08.776 Source: Documents. Used to determine if a statement has been generated Used on Statement? No, Used for logic for determining if we've completed publsihing data downstream" },
    lastProcessAttempt: { type: DataTypes.DATE, allowNull: true, comment: "Example Output: 2025-05-12 15:08:08.776 Source: Documents. Used to determine if a statement has been generated Used on Statement? No, Used for logic for determining the last time it's been retried" }
  },
  {
    tableName: 'dax',
    freezeTableName: true,
    timestamps: false
  })
  dax.associate = function (models) {
    dax.belongsTo(models.dax, {
      foreignKey: 'calculationId',
      as: 'daxEntries'
    })
  }
  return dax
}

module.exports = daxDB
