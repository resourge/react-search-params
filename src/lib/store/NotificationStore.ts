import { UrlChangeEvent } from '../utils';
import { ActionType, EVENTS } from '../utils/navigationEvents/Events';

export type StoreValue = { 
	action: ActionType
	url: URL 
}

class NotificationStore {
	public notification = new Set<() => void>();

	private value: [url: URL, action: ActionType] = [new URL(window.location.href), EVENTS.initial];

	constructor() {
		window.addEventListener('URLChange', (event: UrlChangeEvent) => {
			const { url, action } = event;
			if ( 
				this.value[0].href !== url.href ||
				this.value[1] !== action
			) {
				this.value = [
					url,
					action 
				];

				this.notification.forEach((method) => method())
			}
		})
	}

	public subscribe = (notification: () => void) => {
		this.notification.add(notification);

		return () => {
			this.notification.delete(notification);
		}
	}

	public getValue() {
		return this.value
	}
}
 
export default new NotificationStore();
