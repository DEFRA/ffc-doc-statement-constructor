module.exports = (sequelize, DataTypes) => {
  const claimAgreement = sequelize.define('claimAgreement', {
    claimAgreementId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    frn: DataTypes.BIGINT,
    claimId: DataTypes.STRING,
    agreementNumber: DataTypes.STRING
  },
  {
    tableName: 'claimAgreements',
    freezeTableName: true,
    timestamps: false
  })
  return claimAgreement
}
