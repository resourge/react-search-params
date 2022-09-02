import { useEffect, useRef } from 'react';

/**
 * Simulates `useEffect`, but calls the method in the render instead.
 * This is to prevent cases where navigation on children's `useEffect` 
 * take priority and the system doesn't recognize the change.
 */
export const useEffectRef = (cb: () => () => void) => {
	const unmountRef = useRef<(() => void) | null>(null);

	if ( !unmountRef.current ) {
		const unmounted = cb();

		unmountRef.current = () => {
			unmounted()
			unmountRef.current = null
		}
	}

	useEffect(() => {
		return () => {
			unmountRef.current && unmountRef.current()
		}
	}, [])
}
