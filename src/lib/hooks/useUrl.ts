/* eslint-disable no-restricted-globals */
import { useState } from 'react';

import { initiateNavigationEvents } from '../utils/initiateNavigationEvents';
import { UrlChangeEvent } from '../utils/navigationEvents/Events';

import { useEffectRef } from './useEffectRef';

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

	useEffectRef(() => {
		const checkForUpdates = (event: UrlChangeEvent) => {
			const { url: newUrl } = event;

			setUrl(newUrl);
		};

		addEventListener('URLChange', checkForUpdates)

		return () => removeEventListener('URLChange', checkForUpdates)
	})

	return url;
}
