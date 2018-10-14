
module.exports = async (fastify)=>{

    const {
        USE_SEQUELIZE
    } = process.env

    fastify = await require('./_auth')(fastify)

    if (USE_SEQUELIZE){
        fastify = await require('./_sequelize')(fastify)
    }

    // Important: Always last so pre handlers above are bound to all routes
    fastify = await require('./_routes')(fastify)
    
    return fastify
}