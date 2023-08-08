/// <reference types="vitest" />

import react from '@vitejs/plugin-react'
import fs from 'fs'

import { defineLibConfig } from './config/defineLibConfig';

// https://vitejs.dev/config/
export default defineLibConfig(
	() => ({
		plugins: [
			react()
		
		]
	}),
	() => {
		const indexDFilepath = './dist/index.d.ts';
		const content = fs.readFileSync(indexDFilepath, 'utf-8');
		const globalEventsContent = fs.readFileSync('./src/lib/utils/navigationEvents/GlobalEvents.ts', 'utf-8');

		const index = globalEventsContent.indexOf('declare global')

		fs.writeFileSync(indexDFilepath, `${content}${globalEventsContent.substring(index)}`, 'utf-8');
	}
)
