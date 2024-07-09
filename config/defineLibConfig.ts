import deepmerge from '@fastify/deepmerge'
import { resolve } from 'path'
import { defineConfig, type UserConfigExport } from 'vite'
import banner from 'vite-plugin-banner'
import { checker } from 'vite-plugin-checker'
import dts from 'vite-plugin-dts'
import viteTsconfigPaths from 'vite-tsconfig-paths'

import PackageJson from '../package.json'

import { createBanner } from './createBanner'
import { packages } from './getPackages'

const {
	dependencies = {}, devDependencies = {}, peerDependencies = {}
} = PackageJson as any;

const globals: Record<string, string> = {
	vue: 'Vue',
	'react/jsx-runtime': 'ReactJsxRuntime',
	react: 'React',
	'react-dom': 'ReactDOM'
}

const globalsKeys = Object.keys(globals);

const external = [
	'react/jsx-runtime',
	...Object.keys(peerDependencies),
	...Object.keys(dependencies),
	...Object.keys(devDependencies)
]
const packagesNames = packages.map((pack) => pack.name);

const entryLib = './src/lib/index.ts';

const deepMerge = deepmerge();

export const defineLibConfig = (
	config: UserConfigExport,
	afterBuild?: (() => void | Promise<void>)
): UserConfigExport => defineConfig((originalConfig) => deepMerge(
	typeof config === 'function' ? config(originalConfig) : config,
	{
		define: originalConfig.mode !== 'production' ? {
			__DEV__: (originalConfig.mode === 'development').toString()
		} : {},
		test: {
			globals: true,
			environment: 'jsdom',
			setupFiles: './src/setupTests.ts'
		},
		build: {
			minify: false,
			lib: {
				entry: entryLib,
				name: 'index',
				fileName: 'index',
				formats: ['es']
			},
			sourcemap: true,
			outDir: './dist',
			rollupOptions: {		
				output: {
					dir: './dist',
					globals: external.filter((key) => globalsKeys.includes(key))
					.reduce<Record<string, string>>((obj, key) => {
						obj[key] = globals[key];
						return obj
					}, {}),
					inlineDynamicImports: false,
					preserveModules: true,
					entryFileNames: '[name].js',
					chunkFileNames: (chunkInfo) => chunkInfo.name.split('lib/')[1]
				},
				external
			}
		},
		resolve: {
			preserveSymlinks: true,
			alias: originalConfig.mode === 'development' ? packages.reduce((obj, { name, path }) => {
				obj[name] = resolve(path, `../${entryLib}`)
				return obj;
			}, {}) : {}
		},
		plugins: [
			banner(createBanner()),
			viteTsconfigPaths(),
			checker({ 
				typescript: true,
				enableBuild: true,
				overlay: {
					initialIsOpen: false
				},
				eslint: {
					lintCommand: 'eslint "./src/**/*.{ts,tsx}"'
				}
			}),
			dts({
				insertTypesEntry: true,

				bundledPackages: packagesNames,
				compilerOptions: {
					preserveSymlinks: true,
					paths: {}
				},
				exclude: [
					'**/*.test*',
					'./src/App.tsx',
					'./src/main.tsx',
					'./src/setupTests.ts'
				],
				afterBuild
			})
		]
	}
));
