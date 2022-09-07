import {
	EVENTS,
	pushState,
	replaceState,
	UrlChangeEvent,
	BeforeUrlChangeEvent,
	go,
	back,
	forward,
	popState,
	eventBeforeUrlChange,
	eventURLChange,
	setLastURLChangeEvent,
	getLastURLChangeEvent
} from './navigationEvents/Events'

const getBeforeEvents = () => {
	const beforeEvents: Array<(e: BeforeUrlChangeEvent) => boolean> = []
	const originalAddEventListener = window.addEventListener;

	window.addEventListener = function (...args: any[]) {
		if ( args[0] === eventBeforeUrlChange ) {
			beforeEvents.push(args[1])
		} 
		if (args[0] === eventURLChange && getLastURLChangeEvent()) {
			args[1](getLastURLChangeEvent());
			setLastURLChangeEvent(null);
		}
			
		return originalAddEventListener.apply(this, args as any);
	};

	const originalRemoveEventListener = window.removeEventListener;
	window.removeEventListener = function (...args: any[]) {
		if ( args[0] === eventBeforeUrlChange ) {
			const eventIndex = beforeEvents.findIndex((cb) => cb === args[1]);
			if ( eventIndex > -1 ) {
				beforeEvents.splice(eventIndex, 1)
			}
		} 
		if (args[0] === eventURLChange && !getLastURLChangeEvent()) {
			setLastURLChangeEvent(null);
		}
			
		return originalRemoveEventListener.apply(this, args as any);
	};

	return beforeEvents;
}

/**
 * Initiate some event's to catch {@link URL} changes.
 */
export const initiateBeforeURLChanges = () => {
	const beforeEvents = getBeforeEvents();

	const originalHistory: History = {} as unknown as History;

	for (const _type of [pushState, replaceState, go, back, forward]) {
		const type = _type as keyof Pick<History, 'pushState' | 'replaceState'>;
		const original = window.history[type];
		
		window.history[type] = function (...args) {
			const event = new BeforeUrlChangeEvent(
				EVENTS[type],
				() => {
					original.apply(this, args);
				}
			);

			if ( 
				beforeEvents && 
				beforeEvents.length && 
				beforeEvents.some((cb) => !cb(event)) 
			) {
				return;
			}

			return original.apply(this, args);
		};
		originalHistory[type] = original.bind(window.history)
	}

	window.addEventListener(popState, () => {
		const event = new BeforeUrlChangeEvent(
			EVENTS[popState],
			() => {
				originalHistory.back();
			}
		);

		if ( beforeEvents && beforeEvents.length && beforeEvents.some((cb) => !cb(event)) ) {
			originalHistory.forward();
			return;
		}

		const urlChangeEvent = new UrlChangeEvent(EVENTS[popState]);
		setLastURLChangeEvent(urlChangeEvent);
		dispatchEvent(urlChangeEvent);
	}, false)

	window.addEventListener('beforeunload', (e) => {
		const event = new BeforeUrlChangeEvent(
			EVENTS[popState],
			() => {
				originalHistory.back();
			}
		);

		if ( 
			beforeEvents && 
			beforeEvents.length && 
			beforeEvents.some((cb) => !cb(event)) 
		) {
			// Cancel the event.
			e.preventDefault();
			// Chrome (and legacy IE) requires returnValue to be set.
			e.returnValue = '';
	
			return ''
		}
	})
}
