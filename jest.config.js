module.exports = {
    preset: 'ts-jest',
    verbose: true,
    testEnvironment: 'node',
    cacheDirectory: './cache',
    name: 'laminar-flux',
    
    coverageThreshold: {
        global: {
            statements: 80
        }
    },
    transformIgnorePatterns: [
        '/node_modules/(?!react-native|react-clone-referenced-element|react-navigation)'
    ],
    testPathIgnorePatterns: ["lib", "helpers"]
};