/* eslint-disable no-restricted-globals */
import {
	useCallback,
	useEffect,
	useRef,
	useSyncExternalStore
} from 'react'

import { HistoryStore, type StoreValue } from '@resourge/history-store/mobile';

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
			unsubscribeRef.current = HistoryStore.subscribe(notification);
			return () => {}
		}, []),
		() => HistoryStore.getValue(),
		() => HistoryStore.getValue()
	);
}
