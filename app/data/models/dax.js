module.exports = (sequelize, DataTypes) => {
  const number30 = 30
  const number200 = 200
  const dax = sequelize.define('dax', {
    calculationId: { type: DataTypes.INTEGER },
    paymentReference: { type: DataTypes.STRING(number30), primaryKey: true, allowNull: false },
    paymentPeriod: { type: DataTypes.STRING(number200), allowNull: false },
    paymentAmount: { type: DataTypes.NUMERIC, allowNull: false },
    transactionDate: { type: DataTypes.DATE, allowNull: false },
    datePublished: { type: DataTypes.DATE, allowNull: true }
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
