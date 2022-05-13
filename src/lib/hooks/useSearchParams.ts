import { useCallback, useMemo, useRef } from 'react';

import { SearchLocation } from '../types/types';
import { createPath } from '../utils';
import { createLocation } from '../utils/createLocation';
import { getParams, serializeParams } from '../utils/utils';

import { useSearchLocation } from './useSearchLocation';

export type SearchParams<T extends Record<string, any> = Record<string, any>> = {
	/**
	 * Current {@link SearchLocation} search
	 */
	search: string
	/**
	 * Current `{@link SearchLocation} params
	 */
	params: T
	/**
	 * Current `{@link SearchLocation} Location
	 */
	location: SearchLocation
}

export type SearchConfig = {
	/**
	 * Uses {@link SearchLocation#search} from `hash`
	 * Create a {@link SearchLocation} from `hash`
	 * then uses it search
	 */
	hash?: boolean 
}

export type SearchNavigate = <T extends Record<string, any> = Record<string, any>>(config: SearchParams<T>) => void

/**
 * Create {@link SearchLocation} updating search with newSearch
 */
export const createNewLocationWithSearch = (
	location: SearchLocation, 
	newSearch: string,
	hash?: boolean
): SearchLocation => {
	if ( hash ) {
		const hashLocation: SearchLocation | undefined = 
			hash ? createLocation(
				location.hash.substring(1, location.hash.length)
			) : undefined;

		if ( !hashLocation ) {
			throw new Error('It was not possible to create a location from hash.')
		}

		const newLocation = createPath({
			...hashLocation,
			search: newSearch
		})

		return createLocation({
			...location,
			hash: location.hash.replace(hashLocation.path, newLocation)
		})
	}
	
	return createLocation({
		...location,
		search: newSearch
	});
}

/**
 * Returns a {@link SearchParams}, and a method to update the params.
 * @param navigate - method to trigger navigation
 * @param defaultParams - default search params
 * @param config {SearchConfig}
 */
export const useSearchParams = <T extends Record<string, any>>(
	navigate: SearchNavigate,
	defaultParams?: T,
	config?: SearchConfig
): [SearchParams<T>, (newParams: T) => void] => {
	const location = useSearchLocation();

	const hash = config?.hash;
	const hashLocation: SearchLocation | undefined = hash ? createLocation(location.hash.substring(1, location.hash.length)) : undefined;

	const search = hash 
		? hashLocation?.search ?? ''
		: location.search;

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const params = useMemo(() => getParams<T>(search, defaultParams ?? {} as unknown as T), [search]);

	const stateRef = useRef<SearchParams<T>>({ params, search, location });

	stateRef.current = {
		params,
		search,
		location
	}

	const onParamsChangeRef = useRef(navigate);

	onParamsChangeRef.current = navigate;

	const onParams = useCallback((newParams: T) => {
		const newSearch = serializeParams<T>(newParams);

		if ( stateRef.current.search !== newSearch ) {
			const newLocation = createNewLocationWithSearch(
				location,
				newSearch,
				hash
			);

			stateRef.current = {
				location: newLocation,
				search: newSearch,
				params: newParams
			}

			onParamsChangeRef.current(stateRef.current)
		}
	}, [hash, location])

	return [stateRef.current, onParams];
}
