export const popState = 'popstate'
export const pushState = 'pushState'
export const replaceState = 'replaceState'
export const go = 'go'
export const back = 'back'
export const forward = 'forward'
export const beforeunload = 'beforeunload'

export const eventURLChange = 'URLChange' as const;
export const eventBeforeUrlChange = 'beforeURLChange' as const;

export const EVENTS = {
	[popState]: 'pop',
	[pushState]: 'push',
	[replaceState]: 'replace',
	[go]: go,
	[back]: back,
	[forward]: forward,
	initial: 'initial',
	[beforeunload]: 'beforeunload'
} as const

export const EVENTS_KEYS = Object.keys(EVENTS)

export type ActionType = typeof EVENTS[keyof typeof EVENTS]

// eslint-disable-next-line prefer-const
let _lastURLChangeEvent: UrlChangeEvent | null = null;

export const setLastURLChangeEvent = (lastURLChangeEvent: UrlChangeEvent | null) => {
	_lastURLChangeEvent = lastURLChangeEvent;
}

export const getLastURLChangeEvent = () => {
	return _lastURLChangeEvent
}

export class UrlChangeEvent extends Event {
	constructor(
		public action: ActionType,
		public url: URL
	) {
		super(eventURLChange);
	}
}

export class BeforeUrlChangeEvent extends Event {
	constructor(
		public action: ActionType,
		public url: URL,
		public next: () => void
	) {
		super(
			eventBeforeUrlChange, 
			{
				cancelable: true 
			}
		);
	}
}
