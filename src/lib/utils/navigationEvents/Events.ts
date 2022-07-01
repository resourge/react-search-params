export const popState = 'popstate'
export const pushState = 'pushState'
export const replaceState = 'replaceState'
export const go = 'go'
export const back = 'back'
export const forward = 'forward'

export const eventURLChange = 'URLChange' as const;
export const eventBeforeUrlChange = 'beforeURLChange' as const;

export const EVENTS = {
	[popState]: 'pop',
	[pushState]: 'push',
	[replaceState]: 'replace',
	[go]: go,
	[back]: back,
	[forward]: forward
} as const

export class UrlChangeEvent extends Event {
	public url: URL;

	constructor(
		public action: typeof EVENTS[keyof typeof EVENTS]
	) {
		super(eventURLChange);

		this.url = new URL(window.location.href);
	}
}

export class BeforeUrlChangeEvent extends Event {
	public url: URL;

	constructor(
		public action: typeof EVENTS[keyof typeof EVENTS],
		public next: () => void
	) {
		super(eventURLChange, { cancelable: true });

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
	
	function addEventListener(type: typeof eventBeforeUrlChange, listener: (e: BeforeUrlChangeEvent) => boolean | Promise<boolean>, options?: boolean | AddEventListenerOptions): void;
	function addEventListener(type: typeof eventURLChange, listener: (e: UrlChangeEvent) => void, options?: boolean | AddEventListenerOptions): void;
	
	function removeEventListener(type: typeof eventBeforeUrlChange, listener: (e: BeforeUrlChangeEvent) => boolean | Promise<boolean>, options?: boolean | EventListenerOptions): void;
	function removeEventListener(type: typeof eventURLChange, listener: (e: UrlChangeEvent) => void, options?: boolean | EventListenerOptions): void;
}
