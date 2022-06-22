/* eslint-disable no-restricted-globals */
import { useEffect, useState } from 'react'

import { initiateNavigationEvents } from '../utils/initiateNavigationEvents';

// Checks if "resourge_history" was already initiated
// This is to prevent "resourge_history" from being initiated multiple times
if ( !window.resourge_history ) {
	initiateNavigationEvents();
}

/**
 * Returns the current {@link URL} object.
 * @returns {URL}
 */
export const useUrl = (): URL => {
	const [url, setUrl] = useState<URL>(() => new URL(window.location.href))

	useEffect(() => {
		const checkForUpdates = ({ url }: UrlChangeEvent) => {
			setUrl(url);
		};

		addEventListener('URLChange', checkForUpdates)

		return () => removeEventListener('URLChange', checkForUpdates)
	}, [])

	return url;
}
