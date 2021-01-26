import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const extensions = ['.ts']
const noDeclarationFiles = { compilerOptions: { declaration: false } }

const makeExternalPredicate = (externalArr) => {
    if (externalArr.length === 0) {
        return () => false
    }
    const pattern = new RegExp(`^(${externalArr.join('|')})($|/)`)
    return (id) => pattern.test(id)
}

const babelRuntimeVersion = pkg.dependencies['@babel/runtime'].replace(
    /^[^0-9]*/,
    ''
)


export default [
    // CommonJS
    {
        input: 'src/index.ts',
        output: { file: 'lib/laminar-flux.js', format: 'cjs', indent: false },
        external: makeExternalPredicate([
            ...Object.keys(pkg.dependencies || {}),
            ...Object.keys(pkg.peerDependencies || {}),
        ]),
        plugins: [
            nodeResolve({
                extensions,
            }),
            typescript({ useTsconfigDeclarationDir: true }),
            babel({
                extensions,
                plugins: [
                    ['@babel/plugin-transform-runtime', { version: babelRuntimeVersion }]
                ],
                babelHelpers: 'runtime'
            }),
        ],
    },

    // ES
    {
        input: 'src/index.ts',
        output: { file: 'es/laminar-flux.js', format: 'es', indent: false },
        external: makeExternalPredicate([
            ...Object.keys(pkg.dependencies || {}),
            ...Object.keys(pkg.peerDependencies || {}),
        ]),
        plugins: [
            nodeResolve({
                extensions,
            }),
            typescript({ tsconfigOverride: noDeclarationFiles }),
            babel({
                extensions,
                plugins: [
                    [
                        '@babel/plugin-transform-runtime',
                        { version: babelRuntimeVersion, useESModules: true },
                    ]
                ],
                babelHelpers: 'runtime'
            }),
        ],
    },

    // UMD Development
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/laminar-flux.js',
            format: 'umd',
            name: 'LaminarFlux',
            indent: false,
        },
        plugins: [
            nodeResolve({
                extensions,
            }),
            typescript({ tsconfigOverride: noDeclarationFiles }),
            babel({
                extensions,
                exclude: 'node_modules/**',
            }),
            replace({
                'process.env.NODE_ENV': JSON.stringify('development'),
            }),
        ],
    },

    // UMD Production
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/laminar-flux.min.js',
            format: 'umd',
            name: 'LaminarFlux',
            indent: false,
        },
        plugins: [
            nodeResolve({
                extensions,
            }),
            typescript({ tsconfigOverride: noDeclarationFiles }),
            babel({
                extensions,
                exclude: 'node_modules/**',
            }),
            replace({
                'process.env.NODE_ENV': JSON.stringify('production'),
            }),
            terser({
                compress: {
                    pure_getters: true,
                    unsafe: true,
                    unsafe_comps: true,
                    warnings: false,
                },
            }),
        ],
    },
];