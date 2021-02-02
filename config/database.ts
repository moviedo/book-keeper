/**
 * Config source: https://git.io/JesV9
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Env from '@ioc:Adonis/Core/Env'
import { OrmConfig } from '@ioc:Adonis/Lucid/Orm'
import Application from '@ioc:Adonis/Core/Application'
import { DatabaseConfig, PostgreConfig, SqliteConfig } from '@ioc:Adonis/Lucid/Database'

const DB_CONNECTION = Env.get('DB_CONNECTION', 'sqlite') as string
const NODE_ENV = Env.get('NODE_ENV', 'development') as string

function getConnection(connection: string, env: string): SqliteConfig | PostgreConfig {
  if (connection === 'psotgres') {
    return {
      client: 'pg',
      connection: {
        host: Env.get('PG_HOST'),
        port: Env.get('PG_PORT'),
        user: Env.get('PG_USER'),
        password: Env.get('PG_PASSWORD', ''),
        database: env === 'test' ? `test_${Env.get('PG_DB_NAME')}` : Env.get('PG_DB_NAME'),
      },
      healthCheck: false,
      debug: false,
    }
  } else {
    const path = env === 'development' ? 'db.sqlite3' : 'test.sqlite3'

    return {
      client: 'sqlite',
      connection: {
        filename: Application.tmpPath(path),
      },
      useNullAsDefault: true,
      healthCheck: false,
      debug: false,
    }
  }
}

const databaseConfig: DatabaseConfig & { orm: Partial<OrmConfig> } = {
  /*
  |--------------------------------------------------------------------------
  | Connection
  |--------------------------------------------------------------------------
  |
  | The primary connection for making database queries across the application
  | You can use any key from the `connections` object defined in this same
  | file.
  |
  */
  connection: DB_CONNECTION,

  connections: {
    /*
    |--------------------------------------------------------------------------
    | SQLite
    |--------------------------------------------------------------------------
    |
    | Configuration for the SQLite database.  Make sure to install the driver
    | from npm when using this connection
    |
    | npm i -D sqlite3
    |
    */
    sqlite: getConnection(DB_CONNECTION, NODE_ENV),

    /*
    |--------------------------------------------------------------------------
    | PostgreSQL config
    |--------------------------------------------------------------------------
    |
    | Configuration for PostgreSQL database. Make sure to install the driver
    | from npm when using this connection
    |
    | npm i pg
    |
    */
    pg: getConnection(DB_CONNECTION, NODE_ENV),
  },

  /*
  |--------------------------------------------------------------------------
  | ORM Configuration
  |--------------------------------------------------------------------------
  |
  | Following are some of the configuration options to tweak the conventional
  | settings of the ORM. For example:
  |
  | - Define a custom function to compute the default table name for a given model.
  | - Or define a custom function to compute the primary key for a given model.
  |
  */
  orm: {},
}

export default databaseConfig
