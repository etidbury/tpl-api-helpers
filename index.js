module.exports.fastifySequelizePlugin=require('./sequelize').fastifySequelizePlugin

module.exports.fastifyRoutesPlugin=(fastify,opts,next)=>{

    const { 
        ROUTES_PREFIX
    } = process.env

    const routesDir = path.join(process.cwd(), './routes')
    
    readDirR(routesDir)
        .filter(
            file =>
                file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js'
        )
        .forEach(file => fastify.register(require(file), {
            prefix: ROUTES_PREFIX || ''
        }))

}