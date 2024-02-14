module.exports = (sequelize, DataTypes) => {
  const schedule = sequelize.define('schedule', {
    scheduleId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    settlementId: DataTypes.INTEGER,
    paymentRequestId: DataTypes.INTEGER,
    isActiveDocument: DataTypes.BOOLEAN,
    category: DataTypes.STRING,
    completed: DataTypes.DATE,
    started: DataTypes.DATE,
    voided: DataTypes.DATE
  },
  {
    tableName: 'schedules',
    freezeTableName: true,
    timestamps: false
  })
  schedule.associate = function (models) {
    schedule.belongsTo(models.settlement, {
      foreignKey: 'settlementId',
      as: 'settlements'
    })
    schedule.belongsTo(models.paymentRequest, {
      foreignKey: 'paymentRequestId',
      as: 'paymentRequest'
    })
  }
  return schedule
}
