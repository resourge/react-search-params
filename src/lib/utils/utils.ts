import { parseParams } from './parseParams';
import { parseSearch } from './parseSearch';

/**
 * Converts a search string into params and merge them with the defaultParams
 * @param search {string}
 * @param defaultParams {Record<string, any>}
 * @returns {Record<string, any>}
 */
export const getParams = <T extends Record<string, any> = Record<string, any>>(
	search: string, 
	defaultParams: T
): T => {
	const params = parseSearch<T>(search);

	return {
		...defaultParams,
		...params
	}
}

/**
 * Converts paramsValue into a search string
 * @param paramValues
 * @returns {string}
 */
export const serializeParams = <T extends Record<string, any>>(paramValues: T): string => {
	const params = parseParams(
		paramValues
	)
	return `${params ? '?' : ''}${params}`
}
