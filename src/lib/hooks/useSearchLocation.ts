/* eslint-disable no-restricted-globals */
import { useEffect, useState } from 'react'

import { SearchLocation } from '../types/types';
import { createLocation } from '../utils/createLocation';
import { initiateLocationChange } from '../utils/initiateLocationChange';

// Checks if "resourge_history" was already initiated
// This is to prevent "resourge_history" from being initiated multiple times
if ( !window.resourge_history ) {
	initiateLocationChange();
}

/**
 * Returns the current {@link SearchLocation} object.
 * @returns {SearchLocation}
 */
export const useSearchLocation = (): SearchLocation => {
	const [location, setLocation] = useState<SearchLocation>(() => createLocation(window.location))

	useEffect(() => {
		const checkForUpdates = ({ location }: LocationChangeEvent) => {
			setLocation(createLocation(location));
		};

		addEventListener('locationChange', checkForUpdates)

		return () => removeEventListener('locationChange', checkForUpdates)
	}, [])

	return location;
}
