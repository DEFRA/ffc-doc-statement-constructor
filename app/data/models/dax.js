module.exports = (sequelize, DataTypes) => {
  const number30 = 30
  const number200 = 200
  const dax = sequelize.define('dax', {
    paymentReference: { type: DataTypes.STRING(number30), allowNull: false },
    calculationId: { type: DataTypes.INTEGER },
    paymentPeriod: { type: DataTypes.STRING(number200), allowNull: true },
    paymentAmount: { type: DataTypes.NUMERIC, allowNull: false },
    transactionDate: { type: DataTypes.DATE, allowNull: false },
    datePublished: { type: DataTypes.DATE, allowNull: true },
    daxId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    startPublish: { type: DataTypes.DATE, allowNull: true },
    completePublish: { type: DataTypes.DATE, allowNull: true },
    lastProcessAttempt: { type: DataTypes.DATE, allowNull: true }
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
