import { useEffect, useRef } from 'react';

/**
 * Simulates `useEffect`, but calls the method in the render instead.
 * This is to prevent cases where navigation on children's `useEffect` 
 * take priority and the system doesn't recognize the change.
 */
export const useEffectRef = (cb: () => () => void) => {
	const isMounted = useRef(false);
	const unmountRef = useRef(() => {});

	if ( !isMounted.current ) {
		isMounted.current = true;

		const unmounted = cb();

		unmountRef.current = () => {
			unmounted()
			unmountRef.current = () => {}
		}
	}

	useEffect(() => {
		return () => unmountRef.current()
	}, [])
}
