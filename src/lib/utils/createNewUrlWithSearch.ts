
/**
 * Create {@link URL} updating search with newSearch
 */
export const createNewUrlWithSearch = (
	url: URL, 
	newSearch: string,
	hash?: boolean
): URL => {
	if ( hash ) {
		const hashUrl: URL = new URL(
			url.hash.substring(1, url.hash.length), 
			window.location.origin
		);

		const newPath = new URL(hashUrl)
		newPath.search = newSearch;
		
		url.hash = url.hash ? url.hash
		.replace(
			hashUrl.href, 
			newPath.href.replace(newPath.origin, '')
		) : newPath.href.replace(newPath.origin, '');

		return new URL(url)
	}

	url.search = newSearch;
	
	return new URL(url);
}
