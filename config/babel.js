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

const baseURL = isProd ? './dist' : './src'

// todo: improve module resolving (currently '../../dist/(...)' should be relative '../(...)')

const alias = {
    routes: './' + path.join(baseURL,'./routes'),
    lib: './' + path.join(baseURL,'./lib'),
    services: './' + path.join(baseURL,'./services'),
    util: './' + path.join(baseURL,'./util'),
    config: './' + path.join(baseURL,'./config')
}
// const alias = {
//     routes: './' ,
//     lib: './' ,
//     services: './',
//     util: './',
//     config: './' 
// }

const plugins = [
    '@babel/proposal-optional-chaining',
    [
        'module-resolver',
        {
            root: [baseURL],
            alias
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
