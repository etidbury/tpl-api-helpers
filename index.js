const path = require('path')
const { readDirR } = require('./util')
const {
    ROUTES_PREFIX
} = process.env
module.exports.routesPlugin = (fastify)=>{
      // -----------Register routes ----------- //
      const routesDir = path.join(process.cwd(), './routes')
    
      readDirR(routesDir)
          .filter(
              file =>
                  file.indexOf('.') !== 0 &&
              //file !== basename &&
              file.slice(-3) === '.js'
          )
          .forEach(file => fastify.register(require(file), {
              prefix: ROUTES_PREFIX || ''
          }))
      // -----------Register routes ----------- //
}
module.exports.fastifySequelizeAndRoutesPlugin = require('./sequelize').fastifySequelizeAndRoutesPlugin