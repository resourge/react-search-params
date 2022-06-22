import { useMemo } from 'react';

import { parseParams, parseSearchParams } from '../utils';
import { createNewUrlWithSearch } from '../utils/createNewUrlWithSearch';

import { useUrl } from './useUrl';

export type SearchParams<T extends Record<string, any> = Record<string, any>> = {
	/**
	 * Current {@link URL} params
	 */
	params: T
	/**
	 * Current {@link URL}
	 */
	url: URL
}

export type SearchConfig = {
	/**
	 * Uses {@link URL#search} from `hash`
	 * Create a {@link URL} from `hash`
	 * then uses it search
	 */
	hash?: boolean 
}

export type SearchNavigate = <T extends Record<string, any> = Record<string, any>>(config: SearchParams<T>) => void

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
	const url = useUrl();

	const hash = config?.hash;

	let search: string = url.search;
	let searchParams: URLSearchParams = url.searchParams

	if ( config?.hash ) {
		const hashUrl: URL = new URL(
			url.hash.substring(1, url.hash.length), 
			window.location.origin
		);

		search = hashUrl.search;
		searchParams = hashUrl.searchParams;
	}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const params = useMemo(() => parseSearchParams<T>(searchParams, defaultParams), [search]);

	const state: SearchParams<T> = {
		params,
		url
	}

	const onParams = (newParams: T) => {
		const newSearch = parseParams<T>(newParams);

		if ( state.url.search !== newSearch ) {
			const newURL = createNewUrlWithSearch(
				url,
				newSearch,
				hash
			);

			navigate({
				url: newURL,
				params: newParams
			})
		}
	}

	return [state, onParams];
}
