
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
		const hashUrl: URL = new URL(
			_url.hash.substring(1, _url.hash.length), 
			window.location.origin
		);

		const newPath = new URL(hashUrl)
		newPath.search = newSearch;

		_url.hash = _url.hash 
			? _url.hash
			.replace(
				hashUrl.href, 
				newPath.href.replace(newPath.origin, '')
			) 
			: newPath.href.replace(newPath.origin, '');

		return _url
	}

	_url.search = newSearch;
	
	return _url;
}
