const comment = 'Example Output: Source: Documents Used on Statement? No, used to pass configuration details to the CRM to allow integration between the two systems'

const documentTypeDB = (sequelize, DataTypes) => {
  const documentType = sequelize.define('documentType', {
    documentTypeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment
    },
    code: {
      type: DataTypes.STRING,
      comment
    },
    name: {
      type: DataTypes.STRING,
      comment
    },
    description: {
      type: DataTypes.STRING,
      comment
    }
  }, {
    tableName: 'documentTypes',
    freezeTableName: true,
    timestamps: false
  })

  return documentType
}

module.exports = documentTypeDB
