import { getAction, initiateBeforeURLChanges } from './initiateBeforeURLChanges';
import {
	pushState,
	replaceState,
	setLastURLChangeEvent,
	UrlChangeEvent
} from './navigationEvents/Events'

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
				// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
				const result = original.apply(this, args);

				const action = getAction(args[0], type);

				const urlArg = args[2];

				const url = urlArg 
					? (
						typeof urlArg === 'string' 
							? new URL(urlArg, window.location.origin) 
							: urlArg
					) : new URL(window.location.href)
				
				const event = new UrlChangeEvent(action, url);
				setLastURLChangeEvent(event);
				dispatchEvent(event);

				return result;
			};
		}

		Object.defineProperty(window, 'resourge_history', {
			value: 'resourge_history',
			writable: false
		})

		initiateBeforeURLChanges();
	}
}
