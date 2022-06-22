const popState = 'popstate'
const pushState = 'pushState'
const replaceState = 'replaceState'
const eventName = 'URLChange' as const;

const EVENTS = {
	[popState]: 'pop',
	[pushState]: 'push',
	[replaceState]: 'replace'
} as const

class UrlChangeEvent extends Event {
	public url: URL;

	constructor(public action: typeof EVENTS[keyof typeof EVENTS]) {
		super(eventName);

		this.url = new URL(window.location.href);
	}
}

declare global {
	interface Window { 
		resourge_history: string
	}

	export class UrlChangeEvent extends Event {
		public action: typeof EVENTS[keyof typeof EVENTS];
		public url: URL;
	
		constructor(action: typeof EVENTS[keyof typeof EVENTS])
	}

	function addEventListener<K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
	function addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
	function addEventListener(type: typeof eventName, listener: (e: UrlChangeEvent) => void, options?: boolean | AddEventListenerOptions): void;

	function removeEventListener<K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
	function removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
	function removeEventListener(type: typeof eventName, listener: (e: UrlChangeEvent) => void, options?: boolean | EventListenerOptions): void;
}

/**
 * Initiate some event's to catch {@link URL} changes.
 */
export const initiateNavigationEvents = () => {
	/**
	 * While History API does have `popstate` event, the only
	 * proper way to listen to changes via `push/replaceState`
	 * is to monkey-patch these methods.
	 * 
	 * @see https://stackoverflow.com/a/4585031
	 */
	if (typeof window.history !== 'undefined') {
		for (const _type of [pushState, replaceState]) {
			const type = _type as keyof Pick<History, 'pushState' | 'replaceState'>;
			const original = window.history[type];
		
			window.history[type] = function (...args) {
				const result = original.apply(this, args);

				dispatchEvent(new UrlChangeEvent(EVENTS[type]));

				return result;
			};
		}

		window.addEventListener(popState, () => {
			dispatchEvent(new UrlChangeEvent(EVENTS[popState]));
		})

		Object.defineProperty(window, 'resourge_history', {
			value: 'resourge_history',
			writable: false
		})
	}
}
