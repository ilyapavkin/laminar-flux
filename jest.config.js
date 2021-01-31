module.exports = {
    preset: 'ts-jest',
    testRegex: "(/test/.*\\.spec\\.[tj]s)$",
    coverageProvider: "v8",
    // collectCoverage: true,
    //collectCoverageFrom: [
    //    '!lib/**/*'
    //    'src/**/*.{js,jsx,ts,tsx}',
    //    '!src/types/**',
    //    '!**/node_modules/**',
    //    '!**/coverage/**',
    //    '!test/**/*',
    //    '!.js',
    //],
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
        '/node_modules/(?!react-native|react-clone-referenced-element|react-navigation)',
        '/node_modules/(?!@)/'
    ],
    testPathIgnorePatterns: ["lib", "helpers"]
};