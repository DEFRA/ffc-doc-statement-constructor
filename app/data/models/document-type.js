const documentTypeDB = (sequelize, DataTypes) => {
  const documentType = sequelize.define('documentType', {
    documentTypeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'documentTypes',
    freezeTableName: true,
    timestamps: false
  })

  return documentType
}

module.exports = documentTypeDB
