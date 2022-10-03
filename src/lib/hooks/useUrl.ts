/* eslint-disable no-restricted-globals */
import { useEffect, useState } from 'react';

import { initiateNavigationEvents } from '../utils/initiateNavigationEvents';
import { ActionType, EVENTS, UrlChangeEvent } from '../utils/navigationEvents/Events'

// Checks if "resourge_history" was already initiated
// This is to prevent "resourge_history" from being initiated multiple times
if ( !window.resourge_history ) {
	initiateNavigationEvents();
}

/**
 * Returns the current {@link URL} object.
 * @returns {URL}, {@link EventType}
 */
export const useUrl = (): [url: URL, action: ActionType] => {
	const [{ url, action }, setUrl] = useState<{ action: ActionType, url: URL }>(() => ({
		url: new URL(window.location.href),
		action: EVENTS.initial
	}))

	useEffect(() => {
		const checkForUpdates = (event: UrlChangeEvent) => {
			const { url, action } = event;

			setUrl({
				url,
				action 
			});
		};

		addEventListener('URLChange', checkForUpdates)

		return () => removeEventListener('URLChange', checkForUpdates)
	}, [])

	return [url, action];
}
