const path = require('path')
const { readDirR } = require('./util')
const {
    ROUTES_PREFIX,
    NODE_ENV
} = process.env

const isProd = NODE_ENV === 'production'

module.exports.routesPlugin = (fastify)=>{
    // -----------Register routes ----------- //
    const routesDir = path.join(process.cwd(), isProd ? './.build.routes' : './routes')
    // todo: add check routes dir exists

    readDirR(routesDir)
        .filter(
            file =>
                file.indexOf('.') !== 0 &&
              // file !== basename &&
              file.slice(-3) === '.js'
        )
        .forEach(file => {
            const route = require(file)
            // todo: add check type of route and better support for babel compiled
            fastify.register(typeof route.default !== 'undefined' ? route.default : route, {
                prefix: ROUTES_PREFIX || ''
            })
        
        })
    // -----------Register routes ----------- //
}
module.exports.fastifySequelizeAndRoutesPlugin = require('./sequelize').fastifySequelizeAndRoutesPlugin