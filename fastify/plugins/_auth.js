module.exports = async (fastify)=>{

    console.info('> Adding @etidbury/jwtauth preHandler')

    fastify.addHook('preHandler',require('@etidbury/jwtauth'))

    return fastify
}