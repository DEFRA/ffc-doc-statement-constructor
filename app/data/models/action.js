const actionDB = (sequelize, DataTypes) => {
  const number2 = 2
  const number5 = 5
  const number6 = 6
  const number10 = 10
  const number15 = 15
  const number18 = 18
  const number50 = 50
  const number100 = 100

  const action = sequelize.define('action', {
    actionId: { type: DataTypes.INTEGER, primaryKey: true },
    calculationId: { type: DataTypes.INTEGER },
    fundingCode: { type: DataTypes.STRING(number5) },
    groupName: { type: DataTypes.STRING(number100) },
    actionCode: { type: DataTypes.STRING(number5) },
    actionName: { type: DataTypes.STRING(number100) },
    rate: { type: DataTypes.STRING(number50) },
    landArea: { type: DataTypes.DECIMAL(number18, number6) },
    uom: { type: DataTypes.STRING(number10) },
    annualValue: { type: DataTypes.STRING(number50) },
    quarterlyValue: { type: DataTypes.DECIMAL(number15, number2) },
    overDeclarationPenalty: { type: DataTypes.DECIMAL(number15, number2) },
    quarterlyPaymentAmount: { type: DataTypes.DECIMAL(number15, number2) },
    datePublished: { type: DataTypes.DATE, allowNull: true }
  },
  {
    tableName: 'actions',
    freezeTableName: true,
    timestamps: false
  })

  action.associate = function (models) {
    action.belongsTo(models.total, {
      foreignKey: 'calculationId',
      as: 'actions'
    })
  }

  return action
}

module.exports = actionDB
