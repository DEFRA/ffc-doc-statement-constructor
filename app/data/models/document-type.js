const documentTypeDB = (sequelize, DataTypes) => {
  const documentType = sequelize.define('documentType', {
    documentTypeId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, comment: "Example Output: Source: Documents Used on Statement? No, used to pass configuration details to the CRM to allow integration between the two systems" },
    code: { type: DataTypes.STRING, comment: "Example Output: Source: Documents Used on Statement? No, used to pass configuration details to the CRM to allow integration between the two systems"},
    name: { type: DataTypes.STRING, comment: "Example Output: Source: Documents Used on Statement? No, used to pass configuration details to the CRM to allow integration between the two systems"},
    description: { type: DataTypes.STRING, comment: "Example Output: Source: Documents Used on Statement? No, used to pass configuration details to the CRM to allow integration between the two systems"},
  },
  {
    tableName: 'documentTypes',
    freezeTableName: true,
    timestamps: false
  })
  return documentType
}

module.exports = documentTypeDB
