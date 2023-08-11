import { type UrlChangeEvent } from '../utils/index.ts';
import { type ActionType, EVENTS } from '../utils/navigationEvents/Events.ts';

export type StoreValue = [
	url: URL, 
	action: ActionType, 
	previousValue?: [
		url: URL, 
		action: ActionType, 
	]
]

class NotificationStore {
	public notification = new Set<() => void>();

	private value: StoreValue = [
		new URL(window.location.href), 
		EVENTS.initial
	];

	constructor() {
		window.addEventListener('URLChange', (event: UrlChangeEvent) => {
			const { url, action } = event;
			const previousValue = this.value;
			if ( 
				previousValue[0].href !== url.href ||
				this.value[1] !== action
			) {
				this.value = [
					url,
					action,
					[
						previousValue[0],
						previousValue[1]
					]
				];

				this.notification.forEach((method) => {
					method(); 
				})
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
 
// eslint-disable-next-line import/no-anonymous-default-export
export default new NotificationStore();
