import { Dialect } from 'sequelize/types'

function getRequiredEnv(name: string): string {
  const envVar = process.env[name]
  if (!envVar) throw new Error(`Missing env var ${name}`)
  return envVar
}

function getDialect(): Dialect {
  const possibleValues = [
    'mysql',
    'postgres',
    'sqlite',
    'mariadb',
    'mssql',
    'mariadb'
  ]
  const env = getRequiredEnv('DB_DIALECT')
  if (possibleValues.indexOf(env) !== -1) {
    return env as Dialect
  }
  throw new Error(
    `DB_DIALECT should be one of: ${possibleValues} and not: "${env}"`
  )
}

export default {
  HOST: process.env.HOST,
  USER: getRequiredEnv('DB_USER'),
  PASSWORD: process.env.DB_PASSWORD,
  DB: getRequiredEnv('DB_NAME'),
  dialect: getDialect(),
  pool: {
    max:
      (process.env.DB_POOL_MAX && parseInt(process.env.DB_POOL_MAX)) ||
      undefined,
    min:
      (process.env.DB_POOL_MIN && parseInt(process.env.DB_POOL_MIN)) ||
      undefined,
    acquire:
      (process.env.DB_POOL_ACQUIRE && parseInt(process.env.DB_POOL_ACQUIRE)) ||
      undefined,
    idle:
      (process.env.DB_POOL_IDLE && parseInt(process.env.DB_POOL_IDLE)) ||
      undefined
  }
}
