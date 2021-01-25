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
    plugins: []
};
