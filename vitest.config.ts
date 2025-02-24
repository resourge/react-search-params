import { defineConfig } from 'vitest/config';
import { GithubReporter } from 'vitest-github-action';

export default defineConfig({
	test: {
		workspace: [
			defineConfig({
				test: {
					name: 'node',
					include: ['**/*.{test,spec}.ts'],
					reporters: process.env.GITHUB_ACTIONS
						? ['default', new GithubReporter()]
						: 'default'
				}
			}),
			defineConfig({
				test: {
					name: 'browser',
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
					},
					reporters: process.env.GITHUB_ACTIONS
						? ['default', new GithubReporter()]
						: 'default'
				}
			})
		]
	}	
})
