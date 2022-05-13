import { SearchLocation } from '../types/types';

/**
 * Creates path from {@link SearchLocation}
 * @param location 
 * @returns {string}
 */
export function createPath(location: Omit<SearchLocation, 'path'>): string {
	const pathname = location.pathname;
	const search = location.search;
	const hash = location.hash;
	let path = pathname || '/';
	if (search && search !== '?') path += search.charAt(0) === '?' ? search : '?' + search;
	if (hash && hash !== '#') path += hash.charAt(0) === '#' ? hash : '#' + hash;
	
	return path;
}
