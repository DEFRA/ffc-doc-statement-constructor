const defaultDatabasePort = 5432

const isProd = () => {
  return process.env.NODE_ENV === 'production'
}

const dbConfig = {
  database: process.env.POSTGRES_DB || 'ffc_doc_statement_constructor',
  host: process.env.POSTGRES_HOST || 'ffc-doc-statement-constructor-postgres',
  port: process.env.POSTGRES_PORT || defaultDatabasePort,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  schema: process.env.POSTGRES_SCHEMA_NAME || 'public',
  ssl: isProd(),
  logging: process.env.POSTGRES_LOGGING || false,
  pool: {
    max: 150,
    min: 20,
    acquire: 60000,
    idle: 10000
  }
}

module.exports = {
  development: dbConfig,
  production: dbConfig,
  test: dbConfig
}
