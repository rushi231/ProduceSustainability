module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      host: 'localhost',
      port: 3306,
      database: 'produce_sustainability',
      user: 'root',
      password: 'Rushi#23',
      charset: 'utf8'
    },
    pool: {
      min: 2,
      max: 30
    },
    migrations: {
      directory: __dirname + '/knex/migrations'
    }
  },

  staging: {
    client: 'mysql2',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'mysql2',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: __dirname + '/knex/migrations'
    }
  }

};