const organisationDB = (sequelize, DataTypes) => {
  const organisation = sequelize.define('organisation', {
    sbi: { type: DataTypes.INTEGER, primaryKey: true },
    addressLine1: { type: DataTypes.STRING, allowNull: true },
    addressLine2: { type: DataTypes.STRING, allowNull: true },
    addressLine3: { type: DataTypes.STRING, allowNull: true },
    city: { type: DataTypes.STRING, allowNull: true },
    county: { type: DataTypes.STRING, allowNull: true },
    emailAddress: { type: DataTypes.STRING, allowNull: true },
    frn: { type: DataTypes.BIGINT, allowNull: true },
    name: { type: DataTypes.STRING, allowNull: true },
    postcode: { type: DataTypes.STRING, allowNull: true },
    updated: { type: DataTypes.DATE, allowNull: true }
  }, {
    tableName: 'organisations',
    freezeTableName: true,
    timestamps: false
  })

  return organisation
}

module.exports = organisationDB
