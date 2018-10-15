require('dotenv').config()

const path = require('path')

module.exports = {
    'apps': [
        {
            'cwd': process.cwd(),
            'script': './index.js',
            'name': 'oauth-api',
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