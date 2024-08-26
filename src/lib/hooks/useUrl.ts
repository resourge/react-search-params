/* eslint-disable no-restricted-globals */
import {
	useCallback,
	useEffect,
	useRef,
	useSyncExternalStore
} from 'react'

import NotificationStore, { type StoreValue } from '../store/NotificationStore';
import { initiateNavigationEvents } from '../utils/initiateNavigationEvents';

// Checks if "resourge_history" was already initiated
// This is to prevent "resourge_history" from being initiated multiple times
if ( globalThis.window && !window.resourge_history ) {
	initiateNavigationEvents();
}

/**
 * Returns the current {@link URL} object.
 * @returns {URL}, {@link EventType}
 */
export const useUrl = (): StoreValue => {
	// This is because URLChange trigger before useSyncExternalStore `unsubscribe`
	const unsubscribeRef = useRef(() => {})
	useEffect(() => () => {
		unsubscribeRef.current(); 
	}, [])
	return useSyncExternalStore(
		useCallback((notification) => {
			unsubscribeRef.current = NotificationStore.subscribe(notification);
			return () => {}
		}, []),
		() => NotificationStore.getValue(),
		() => NotificationStore.getValue()
	);
}
