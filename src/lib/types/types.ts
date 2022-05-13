export type SearchLocation = {
	/**
     * Returns the Location `hash` fragment (includes leading "#" if non-empty).
     */
	hash: string
	/**
	 * Returns the Location URL's pathname.
	 */
	pathname: string
 
	/**
	 * Returns the Location query (includes leading "?" if non-empty).
	 */
	search: string
 
	/**
	 * Returns the Location path.
	 */
	path: string
}
