import { SearchLocation } from '../types/types';

import { createPath } from './createPath';

/**
 * Parses a string into {@link SearchLocation}
 * @param path
 * @returns {SearchLocation}
 */
function parsePath(path: string): SearchLocation {
	let pathname = path || '/';
	let search = '';
	let hash = '';
	const hashIndex = pathname.indexOf('#');
  
	if (hashIndex !== -1) {
		hash = pathname.substr(hashIndex);
		pathname = pathname.substr(0, hashIndex);
	}
  
	const searchIndex = pathname.indexOf('?');
  
	if (searchIndex !== -1) {
		search = pathname.substr(searchIndex);
		pathname = pathname.substr(0, searchIndex);
	}

	const newLocation: Omit<SearchLocation, 'path'> = {
		pathname: pathname,
		search: search === '?' ? '' : search,
		hash: hash === '#' ? '' : hash
	};
  
	return {
		...newLocation,
		path: createPath(newLocation)
	};
}

/**
 * Create {@link SearchLocation} from a pathName or {@link Location}
 * @param path
 * @returns {SearchLocation}
 */
export function createLocation(
	path: string | Location | Pick<Location, 'hash' | 'pathname' | 'search'>
): SearchLocation {
	const location: SearchLocation = typeof path === 'string' ? parsePath(path) : parsePath(createPath(path));

	try {
		location.pathname = decodeURI(location.pathname);
	}
	catch (e) {
		if (e instanceof URIError) {
			throw new URIError(`Pathname "${location.pathname}" could not be decoded. This is likely caused by an invalid percent-encoding.`);
		}
		else {
			throw e;
		}
	}
	return location;
}
