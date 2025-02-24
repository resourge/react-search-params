/// <reference types="vitest/config" />

import react from '@vitejs/plugin-react-swc';

import { defineLibConfig } from './config/defineLibConfig';

// https://vitejs.dev/config/
export default defineLibConfig(
	() => ({
		plugins: [
			react()
		]
	})
)
