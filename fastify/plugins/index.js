
module.exports = async (fastify)=>{

    const {
        USE_SEQUELIZE
    } = process.env

    try {
    
        console.debug('> Loading fastify plugins...')

        fastify = await require('./_auth')(fastify)

        if (USE_SEQUELIZE){
            fastify = await require('./_sequelize')(fastify)
        }else{
            console.debug('> Not using Sequelize')
        }
        
        // Important: Always last so pre handlers above are bound to all routes
        fastify = await require('./_routes')(fastify)
    }catch(err){
        console.error('API Plugin Error:',err)
        throw err
    }
    
    return fastify
}