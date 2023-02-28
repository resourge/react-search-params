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
	getLastURLChangeEvent,
	EVENTS_KEYS,
	beforeunload
} from './navigationEvents/Events'

/**
 * Checks is data from '(push/replace)State' has action key
 */
export const getAction = (state: any, type: keyof typeof EVENTS) => {
	let action = EVENTS[type];

	if ( state && typeof state === 'object' ) {
		const { action: _action } = state;
		if ( EVENTS_KEYS.includes(_action) ) {
			action = _action
		}
	}

	return action;
}

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
			
		originalAddEventListener.apply(this, args as any);
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
			
		originalRemoveEventListener.apply(this, args as any);
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
			const action = getAction(args[0], type);

			const urlArg = args[2];

			const url = urlArg 
				? (
					typeof urlArg === 'string' 
						? new URL(urlArg, window.location.origin) 
						: urlArg
				) : new URL(window.location.href)

			const event = new BeforeUrlChangeEvent(
				action,
				url,
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

			original.apply(this, args);
		};
		originalHistory[type] = original.bind(window.history)
	}

	let preventDoublePopState = false;
	const popStateCb = () => {
		if ( preventDoublePopState ) {
			preventDoublePopState = false;
			return;
		}

		const url = new URL(document.location.href);

		const event = new BeforeUrlChangeEvent(
			EVENTS[popState],
			url,
			() => {
				originalHistory.back();
			}
		);

		if ( beforeEvents && beforeEvents.length && beforeEvents.some((cb) => !cb(event)) ) {
			preventDoublePopState = true;
			originalHistory.forward();
			return;
		}

		const urlChangeEvent = new UrlChangeEvent(EVENTS[popState], url);
		setLastURLChangeEvent(urlChangeEvent);
		dispatchEvent(urlChangeEvent);
	};
	window.addEventListener(popState, popStateCb, false)

	window.addEventListener(beforeunload, (e) => {
		const event = new BeforeUrlChangeEvent(
			EVENTS[beforeunload],
			new URL(window.location.href),
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
