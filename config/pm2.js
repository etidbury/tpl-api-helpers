require('dotenv').config()

const path = require('path')

const pkgName = require(path.join(process.cwd(),'package')).name

if (!pkgName || !pkgName.length){
    throw new TypeError('PM2 Config: Invalid package name. Make sure you specify a name in your package.json file')
}

module.exports = {
    'apps': [
        {
            'cwd': process.cwd(),
            'script': './index.js',
            'name': pkgName,
            // 'watch': [
            //     './routes'
            // ],
            'env': {
                NODE_ENV: 'production'
            },
            'node_args': '-r dotenv/config'
            // 'interpreter': './node_modules/.bin/babel-node'
        }
        // {
        // 	'script': '*',
        // 	'name': 'test-watch',
        // 	'env': {
        // 		'CLIENT_BASE_URL':CLIENT_BASE_URL
        // 	},
        // 	'node_args':'--config jest.config.js -i --no-cache --watch',
        // 	'interpreter': './node_modules/.bin/jest'
        // },
    ]
}