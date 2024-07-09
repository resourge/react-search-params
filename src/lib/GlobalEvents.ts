import {
	type eventBeforeUrlChange,
	type BeforeUrlChangeEvent,
	type eventURLChange,
	type UrlChangeEvent
} from './utils/navigationEvents/Events'

declare global {
	interface Window { 
		resourge_history: string
	}

	function addEventListener(type: typeof eventBeforeUrlChange, listener: (e: BeforeUrlChangeEvent) => boolean | Promise<boolean>, options?: boolean | AddEventListenerOptions): void;
	function addEventListener(type: typeof eventURLChange, listener: (e: UrlChangeEvent) => void, options?: boolean | AddEventListenerOptions): void;
	
	function removeEventListener(type: typeof eventBeforeUrlChange, listener: (e: BeforeUrlChangeEvent) => boolean | Promise<boolean>, options?: boolean | EventListenerOptions): void;
	function removeEventListener(type: typeof eventURLChange, listener: (e: UrlChangeEvent) => void, options?: boolean | EventListenerOptions): void;
}
