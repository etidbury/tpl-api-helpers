const {
    NODE_ENV
} = process.env

const path = require('path')

const isProd = NODE_ENV === 'production'

const requiredModules = [
    '@babel/core',
    '@babel/preset-env',
    '@babel/preset-flow',
    'babel-plugin-module-resolver',
    '@babel/plugin-proposal-optional-chaining'
]

try {
    for(let i = 0; i < requiredModules.length;i++){
        try {
            require(path.join(process.cwd(),'node_modules',requiredModules[i]))
        }catch (err){
            console.error(`Error requiring module: ${requiredModules[i]}`)
            throw err
        }
    }

} catch (err) {
    console.error('Error: Required Babel plugins/presets not installed')
    console.error(`yarn add ${requiredModules.join(' ')} --dev`)
    console.error('Try running this command:')
    console.error('and try again.')
    
    process.exit(1)
}

const plugins = [
    '@babel/proposal-optional-chaining',
    [
        'module-resolver',
        {
            alias: {
                root: ['./'],
                routes: isProd ? '/.build.routes' : './routes',
                lib: isProd ? '/.build.lib' : './lib',
                services: isProd ? '/.build.services' : './services',
                util: isProd ? '/.build.util' : './util'
            }
        }
    ]
]

const presets = [
    
    '@babel/preset-env',
    '@babel/flow'
    
]

module.exports = {
    presets: presets,
    plugins: plugins,
    ignore: [
        '_*',
        '._*',
        'node_modules/**/*',
        'packages'
    ]
}
