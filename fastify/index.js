const path = require('path')
require('dotenv').config({ path: path.join(process.cwd(), '.env') })

// require('../util/log')

const {
    NODE_ENV,
    DISABLE_LOGS,
    USE_SEQUELIZE
} = process.env

const isProd = NODE_ENV === 'production'

module.exports = (fastify,opts,next)=>{

    try {
        const { ValidationError, UniqueConstraintError } = require('sequelize/lib/errors')
        if (!DISABLE_LOGS) {

            // todo: integrate swagger! https://github.com/fastify/fastify-swagger

            // Pretty print API error responses when user requests within a browser
            const Youch = require('youch')
            const forTerminal = require('youch-terminal')
            fastify.register(require('fastify-sensible'))
                .after(()=>{
                    console.info('> Loaded plugin: fastify-sensible') 
                    if (!isProd){
                    
                        fastify.setErrorHandler(async (err, req, reply) => {
                            
                            // Handle Sequelize errors
                            if (err instanceof ValidationError) {
                                reply.status(400) // Bad Request
                            }
                            else if (err instanceof UniqueConstraintError) {
                                reply.status(409) // Conflict
                            }

                            try {
                                const youch = new Youch(err, reply.request.req)

                                if (req.headers.accept.indexOf('text/html') > -1) {
                                
                                    youch
                                        .addLink(({ message }) => {
                                            const url = `https://stackoverflow.com/search?q=${encodeURIComponent(`${message}`)}`
                                            return `<a href="${url}" target="_blank" title="Search on Stackoverflow">Search StackOverflow</a>`
                                        })
                                        .addLink((opts) => {
                                        // const url = `https://stackoverflow.com/search?q=${encodeURIComponent(`${message}`)}`
                                            const frame = opts.frames[0]
                                            return `<a href="vscode://file${frame.filePath}" title="Open in VSCode">Open in VSCode: ${frame.file}</a>`
                                        })

                                    const html = await youch.toHTML()
                    
                                    // vscode://file/c:/myProject/package.json:5:10
                                    reply.type('text/html')
                                    reply.send(html)
                    
                                }
                                const output = await youch.toJSON()

                                console.error(forTerminal(output))

                            } catch (e) {

                                console.error(e)
                            }

                            reply.send(err)
           
                        })// end fastify.setErrorHandler
                    }// end !isProd
                })// end after

            fastify.register(require('./plugins'))
            // if (USE_SEQUELIZE) {
            //     fastify.register(sequelizePlugin)
               
            // } else {
            //     fastify.register(routesPlugin)
            // }
            
        }

    }catch(err){
        console.error('Fastify Plugin Error',err)
    }  

    next()
    return fastify
}

