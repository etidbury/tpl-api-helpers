const {
    ROUTES_PREFIX,
    NODE_ENV
} = process.env

const isProd = NODE_ENV === 'production'

const path = require('path')

module.exports = async (fastify)=>{
    try{
    
        const { readDirR } = require('../../util')
        // -----------Register routes ----------- //
        const routesDir = path.join(process.cwd(), isProd ? './.build.routes' : './routes')
        // todo: add check routes dir exists
        console.info('> Registering routes')
        readDirR(routesDir)
            .filter(
                file =>
                    file.indexOf('.') !== 0 &&
            // file !== basename &&
            file.slice(-3) === '.js'
            )
            .forEach(file => {
                try {
                    
                    console.info('> Loaded route plugin file:',path.resolve(process.cwd(),file)) 

                    const route = require(file)
                    const routePlugin = typeof route.default !== 'undefined' ? route.default : route

                    if (typeof routePlugin !== 'function'){
                        throw new TypeError('Invalid route plugin:',file)
                    }

                    fastify.register(routePlugin, {
                        prefix: ROUTES_PREFIX || ''
                    })
      
                }catch(err){
                    console.error('Route Plugin Error',err,file)
                }
            })

    }catch(err){
        console.error('Routes Error',err)
    }
    // -----------Register routes ----------- //
    // next()

    return fastify
}