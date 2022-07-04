
/**
 * Create {@link URL} updating search with newSearch
 */
export const createNewUrlWithSearch = (
	url: URL, 
	newSearch: string,
	hash?: boolean
): URL => {
	const _url = new URL(url);
	
	if ( hash ) {
		const hashUrl = _url.hash.substring(1, _url.hash.length);

		const newPath = new URL(hashUrl, window.location.origin);
		newPath.search = newSearch;

		_url.hash = _url.hash 
			? _url.hash.replace(hashUrl, newPath.href.replace(newPath.origin, '')) 
			: newPath.href.replace(newPath.origin, '');

		return _url
	}

	_url.search = newSearch;
	
	return _url;
}
