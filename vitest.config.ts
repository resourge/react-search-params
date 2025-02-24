import { defineConfig } from 'vitest/config';
import { GithubReporter } from 'vitest-github-action';

export default defineConfig({
	test: {
		name: 'browser',
		include: ['**\/src/lib/**'],
		exclude: ['**\/config/**'],
		coverage: {
			provider: 'istanbul',
			exclude: ['**\/config/**/*', '*.config.ts', '**\/src/*', '**\/.*'] 
		},
		reporters: process.env.GITHUB_ACTIONS
			? ['default', new GithubReporter()]
			: 'default',
		workspace: [
			defineConfig({
				test: {
					name: 'node',
					include: ['**/*.{test,spec}.ts']
				}
			}),
			defineConfig({
				test: {
					include: ['**/*.{test,spec}.tsx'],
					setupFiles: './src/setupTests.ts',
					browser: {
						enabled: true,
						provider: 'playwright',
						instances: [
							{
								browser: 'chromium'
							}
						]
					}
				}
			})
		]
	}	
})
