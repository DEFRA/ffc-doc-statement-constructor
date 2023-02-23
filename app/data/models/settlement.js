module.exports = (sequelize, DataTypes) => {
  const settlement = sequelize.define('settlement', {
    settlementId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    paymentRequestId: DataTypes.INTEGER,
    detail: DataTypes.STRING,
    frn: DataTypes.BIGINT,
    generated: DataTypes.BOOLEAN,
    invalid: DataTypes.BOOLEAN,
    invoiceNumber: DataTypes.STRING,
    ledger: DataTypes.STRING,
    received: DataTypes.DATE,
    reference: DataTypes.STRING,
    settled: DataTypes.BOOLEAN,
    settlementDate: DataTypes.DATE,
    sourceSystem: DataTypes.STRING,
    value: DataTypes.INTEGER
  },
  {
    tableName: 'settlements',
    freezeTableName: true,
    timestamps: false
  })
  settlement.associate = function (models) {
    settlement.hasOne(models.schedule, {
      foreignKey: 'settlementId',
      as: 'schedules'
    })
    settlement.belongsTo(models.paymentRequest, {
      foreignKey: 'paymentRequestId',
      as: 'paymentRequests'
    })
  }
  return settlement
}
