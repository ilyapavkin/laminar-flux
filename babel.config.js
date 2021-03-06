const { NODE_ENV } = process.env

module.exports = {
    presets: [
        '@babel/preset-typescript',
        [
            '@babel/preset-env', 
            {
                targets: {
                    node: 'current', 
                    browsers: ['ie >= 11']
                }, 
                exclude: ['transform-async-to-generator', 'transform-regenerator'], 
                modules: false, 
                loose: true
            }
        ],
    ],
    plugins: [
        ['@babel/plugin-proposal-decorators', {legacy: true}],
        ['@babel/plugin-proposal-class-properties', {loose: true}],

        // don't use `loose` mode here - need to copy symbols when spreading
        '@babel/proposal-object-rest-spread',
        NODE_ENV === 'test' && '@babel/transform-modules-commonjs'
    ].filter(Boolean),
    babelrcRoots: [
        '.'
    ]
};
