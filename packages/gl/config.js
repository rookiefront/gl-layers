module.exports = {
    frameworks: ['mocha', 'expect'],
    basePath: '.',
    client: {
        mocha: {
            timeout : 4000
        }
    },
    files: [
        '../../node_modules/maptalks/dist/maptalks.js',
        './dist/maptalksgl-dev.js',
        '../../node_modules/@maptalks/gltf-layer/dist/maptalks.gltf.js',
        'test/**/*.js',
        {
            pattern: 'test/fixtures/**/*',
            included: false
        },
        {
            pattern: 'test/models/**/*',
            included: false
        },
        {
            pattern: 'test/resources/**/*',
            included: false
        }
    ],
    proxies: {
        '/models/': '/base/test/models/',
        '/fixtures/': '/base/test/fixtures/',
        '/resources/': '/base/test/resources/'
    },
    preprocessors: {
    },
    browsers: ['Chrome'],
    reporters: ['mocha']
};