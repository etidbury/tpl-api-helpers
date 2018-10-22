const {
    SEQUELIZE_AUTO_CONNECT
    , SEQUELIZE_SYNC
    , SEQUELIZE_SYNC_FORCE
    , FIXTURES
} = process.env

const path = require('path')
const Sequelize = require('sequelize')
const { readDirR } = require('../../util')

const isProd = process.env.NODE_ENV === 'production'

module.exports = async (fastify)=>{

    const baseSequelizeDir = path.join(process.cwd(),isProd ? './dist' : './src','sequelize')

    const configPath = path.join(baseSequelizeDir,'config')

    const config = require(configPath)
    
    const sequelize = new Sequelize(config)

    console.info('> Initiating Sequelize plugin')

    try {

        const _models = {}

        if (SEQUELIZE_AUTO_CONNECT) {

            await sequelize.authenticate()

            fastify.decorate('sequelize', sequelize)
        
            fastify.addHook('onClose', (fastifyInstance, done) => {
                console.info('> Sequelize: Closing connection...')
                // eslint-disable-next-line promise/prefer-await-to-then
                sequelize.close().then(done).catch(done)
                console.info('> Sequelize: Disconnected.')
            })

        }

        // ----------- Initialise models ----------- //

        console.info('> Initiating models')
        const modelsDir = path.join(baseSequelizeDir, 'models')

        readDirR(modelsDir)
            .filter(file => {
                return (
                    file.indexOf('.') !== 0 &&
                file.slice(-3) === '.js'
                )
            })
            .forEach(file => {
                const model = sequelize['import'](file)

                _models[model.name] = model
            })
        
        Object.keys(_models).forEach(modelName => {
            if (_models[modelName].associate) {
                _models[modelName].associate(_models)
            }

            // support lowercase references to models
            _models[modelName.toLowerCase()] = _models[modelName]
        })

        if (SEQUELIZE_SYNC) {
            await sequelize.sync({ force: SEQUELIZE_SYNC_FORCE })
        }

        // -----------/Initialise models ----------- //
        
        // ----------- Run fixtures ----------- //
        
        if (FIXTURES) {
            
            console.info('> Fixtures: Loading files...')

            const fixturesDir = path.join(baseSequelizeDir, 'fixtures')
                
            const fixturesFileList = readDirR(fixturesDir)
                .filter(file => (
                    file.indexOf('.') !== 0 &&
                    file.slice(-3) === '.js' && 
                    file.indexOf('._') <= -1 // ignore folders/files with ._ in name
                )
                )
    
            for (let i = 0; i < fixturesFileList.length; i++) {
                const fixturesFile = fixturesFileList[i]
                const fixturesFilePretty = './' + path.relative(process.cwd(),fixturesFileList[i])

                try {
            
                    const args = {}
    
                    args.sequelize = sequelize
                    args.models = _models
                    args.model = modelName => {
                        if (!_models[modelName])
                            throw new Error(`Invalid model name '${modelName}'`)
    
                        return _models[modelName]
                    }
    
                    const fixtureMethod = require(fixturesFile)
    
                    console.info('> Fixtures: File ',fixturesFilePretty,'Loading...')
                    if (typeof fixtureMethod !== 'function')
                        throw new TypeError('Invalid fixture format. Please make sure your fixture file returns an executable method')
                    
                    await fixtureMethod(args)
                    console.info('> Fixtures: File ',fixturesFilePretty,'Complete')
    
                }catch(err){
                    console.error('> Fixtures: Error in fixtures file:',fixturesFilePretty)
                    throw err
                }
    
            }// end for
    
            console.info('> Fixtures: Complete')
        
        }// end if FIXTURES
        // -----------/Run fixtures ----------- //

        console.info('> Adding model preHandler')
        // ----------- Attach models to fastify ----------- //
        fastify.addHook('preHandler', async (request, reply) => {
            request.sequelize = sequelize
            request.models = _models
            request.model = modelName => {
                if (!_models[modelName])
                    throw new Error(`Invalid model name '${modelName}'`)

                return _models[modelName]
            }
        })
        // -----------/Attach models to fastify ----------- //
        
    }catch(err) {
      
        try {
            log.info('> Sequelize: Closing connection...')
            await sequelize.close()
            log.info('> Sequelize: Disconnected.')

        }catch(e) {
            // ignore if sequelize has not been started yet
        }

        console.error(err)

        throw err
    }

    return fastify
    // ----------- Gracefully shut down Sequelize connection ----------- //
    // process.stdin.resume()// so the program will not close instantly

    // const onExitHandler = async (exitCode)=>{
     
    //     log.info('\n> Sequelize: Closing connection...')
    //     try {
    //         await sequelize.close()
    //     }catch(e) {
    //         // suppress
    //     }
    //     log.info('> Sequelize: Disconnected.')
    //     process.exit()

    // }

    // const CLEANUP_SIGNALS = [
    //     'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
    //     'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
    // ]
    // // catching signals and do something before exit
    // CLEANUP_SIGNALS.forEach(function (sig) {
    //     process.on(sig, onExitHandler.bind(null))
    // })

    // -----------/Gracefully shut down Sequelize connection ----------- //
}