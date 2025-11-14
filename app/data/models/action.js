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
    actionId: { type: DataTypes.INTEGER, primaryKey: true, comment: 'To be removed. RPA have just confirmed that SFI-23 and SFI-EO statements will not be issued, which has now introduced some technical debt to remove this.' },
    calculationId: { type: DataTypes.INTEGER, comment: 'To be removed. RPA have just confirmed that SFI-23 and SFI-EO statements will not be issued, which has now introduced some technical debt to remove this.' },
    fundingCode: { type: DataTypes.STRING(number5), comment: 'To be removed. RPA have just confirmed that SFI-23 and SFI-EO statements will not be issued, which has now introduced some technical debt to remove this.' },
    groupName: { type: DataTypes.STRING(number100), comment: 'To be removed. RPA have just confirmed that SFI-23 and SFI-EO statements will not be issued, which has now introduced some technical debt to remove this.' },
    actionCode: { type: DataTypes.STRING(number5), comment: 'To be removed. RPA have just confirmed that SFI-23 and SFI-EO statements will not be issued, which has now introduced some technical debt to remove this.' },
    actionName: { type: DataTypes.STRING(number100), comment: 'To be removed. RPA have just confirmed that SFI-23 and SFI-EO statements will not be issued, which has now introduced some technical debt to remove this.' },
    rate: { type: DataTypes.STRING(number50), comment: 'To be removed. RPA have just confirmed that SFI-23 and SFI-EO statements will not be issued, which has now introduced some technical debt to remove this.' },
    landArea: { type: DataTypes.DECIMAL(number18, number6), comment: 'To be removed. RPA have just confirmed that SFI-23 and SFI-EO statements will not be issued, which has now introduced some technical debt to remove this.' },
    uom: { type: DataTypes.STRING(number10), comment: 'To be removed. RPA have just confirmed that SFI-23 and SFI-EO statements will not be issued, which has now introduced some technical debt to remove this.' },
    annualValue: { type: DataTypes.STRING(number50), comment: 'To be removed. RPA have just confirmed that SFI-23 and SFI-EO statements will not be issued, which has now introduced some technical debt to remove this.' },
    quarterlyValue: { type: DataTypes.DECIMAL(number15, number2), comment: 'To be removed. RPA have just confirmed that SFI-23 and SFI-EO statements will not be issued, which has now introduced some technical debt to remove this.' },
    overDeclarationPenalty: { type: DataTypes.DECIMAL(number15, number2), comment: 'To be removed. RPA have just confirmed that SFI-23 and SFI-EO statements will not be issued, which has now introduced some technical debt to remove this.' },
    quarterlyPaymentAmount: { type: DataTypes.DECIMAL(number15, number2), comment: 'To be removed. RPA have just confirmed that SFI-23 and SFI-EO statements will not be issued, which has now introduced some technical debt to remove this.' },
    datePublished: { type: DataTypes.DATE, allowNull: true, comment: 'To be removed. RPA have just confirmed that SFI-23 and SFI-EO statements will not be issued, which has now introduced some technical debt to remove this.' }
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
