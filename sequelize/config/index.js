// const isProd = process.env.NODE_ENV === 'production'

// ensure all required env variables are set for MySQL connection
['MYSQL_HOST', 'MYSQL_DB_NAME', 'MYSQL_USER', 'MYSQL_PASSWORD'].forEach(
    envVarName => {
        if (typeof process.env[envVarName] === 'undefined')
            throw new ReferenceError(
                `Required environment variable not set: ${envVarName}`
            )
    }
)

const {
    MYSQL_HOST
    , MYSQL_DB_NAME
    , MYSQL_USER
    , MYSQL_PASSWORD
    , DISABLE_LOGS
    , SEQUELIZE_LOGGING
} = process.env

module.exports = {
    dialect: 'mysql',
    // "use_env_variable": "MYSQL_CONNECTION_URL",
    host: MYSQL_HOST,
    database: MYSQL_DB_NAME,
    username: MYSQL_USER,
    password: MYSQL_PASSWORD,
    autoConnect: true, // auto authentication and test connection on first run
    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    operatorsAliases: false,
    logging: !DISABLE_LOGS && function(msg){
        console.debug('> Sequelize:',msg)
    },
    // disable inserting undefined values as NULL
    // - default: false
    omitNull: true,
    
    define: {
        freezeTableName: true,
        charset: 'utf8mb4',
        dialectOptions: {
            collate: 'utf8mb4_unicode_ci'
        },
        timestamps: true
    },
    // for emojis:
    // charset: 'utf8mb4',
    // collate: 'utf8mb4_unicode_ci'
    // logging: console.debug
}
