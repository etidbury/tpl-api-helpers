const path = require('path')

const isProd = process.env.NODE_ENV === 'production';

const requiredModules = [
    '@babel/core',
    '@babel/preset-env',
    '@babel/preset-flow',
    'babel-plugin-module-resolver',
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
    [
        'module-resolver',
        {
            alias: {
                root: ['./'],
                routes: isProd ? '/.build.routes' : './routes',
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
