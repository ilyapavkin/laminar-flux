module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
		tsconfigRootDir: '.',
        ecmaVersion: 2018,
        ecmaFeatures: {
            jsx: true
        }
    },
    extends: [
        // '@react-native-community',
        // 'airbnb-typescript',
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'prettier/@typescript-eslint',
        // 'prettier/react',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:prettier/recommended',
    ],
    plugins: [
        'prettier',
        '@typescript-eslint',
        'import',
        'jsdoc'
    ],
    env: {
        node: true,
        browser: true,
        es6: true
    },
    settings: {
        'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx', '.test.ts']
        },
        'import/resolver': {
            'typescript': {
                'alwaysTryTypes': true
            }
        }
    },
    rules: {
        //indent: [2, 4],
        'object-curly-spacing': [2, 'always'],
        //'@typescript-eslint/indent': [2, 4],
        'spaced-comment': [2, 'always', { markers: ['/'] }],
        quotes: [2, 'single'],
        'lines-between-class-members': 0,
        'import/prefer-default-export': 0,
        'import/no-unresolved': 2,
        'import/named': 2,
        'import/namespace': 2,
        'import/default': 2,
        'import/export': 2,
        'prettier/prettier': 0,
        
        /*'react/jsx-filename-extension': [
            2,
            {
                extensions: ['.js', '.jsx'],
            },
        ],
        'react/jsx-indent': [2, 4],
        'react/forbid-prop-types': 0,
        'react/prefer-stateless-function': 0,
        'react/jsx-props-no-spreading': 0,
        'react/destructuring-assignment': 0*/
        'jsdoc/check-alignment': 1,
        'jsdoc/check-indentation': 1,
        'jsdoc/check-param-names': 1,
        'no-warning-comments': [1, {
            terms: ['todo', 'fixme'],
            location: 'anywhere'
        }]
    }
};
