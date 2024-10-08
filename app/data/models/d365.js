module.exports = (sequelize, DataTypes) => {
  const number30 = 30
  const number200 = 200
  const d365 = sequelize.define('d365', {
    paymentReference: { type: DataTypes.STRING(number30), primaryKey: true, allowNull: false, unique: true },
    calculationId: { type: DataTypes.INTEGER, allowNull: true },
    paymentPeriod: { type: DataTypes.STRING(number200), allowNull: true },
    paymentAmount: { type: DataTypes.NUMERIC, allowNull: false },
    transactionDate: { type: DataTypes.DATE, allowNull: false },
    datePublished: { type: DataTypes.DATE, allowNull: true },
    startPublish: { type: DataTypes.DATE, allowNull: true },
    completePublish: { type: DataTypes.DATE, allowNull: true },
    lastProcessAttempt: { type: DataTypes.DATE, allowNull: true }
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
