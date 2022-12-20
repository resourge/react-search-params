/* eslint-disable no-restricted-globals */
import { useCallback, useEffect, useRef } from 'react';

import { useSyncExternalStore } from 'use-sync-external-store/shim';

import NotificationStore from '../store/NotificationStore';
import { initiateNavigationEvents } from '../utils/initiateNavigationEvents';
import { ActionType } from '../utils/navigationEvents/Events'

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
	// This is because URLChange trigger before useSyncExternalStore `unsubscribe`
	const unsubscribeRef = useRef(() => {})
	useEffect(() => {
		return () => {
			unsubscribeRef.current()
		}
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
