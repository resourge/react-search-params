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

	private value: StoreValue = [] as unknown as StoreValue;

	constructor() {
		if ( !globalThis.window ) {
			return;
		}
		this.value = [
			new URL(window.location.href), 
			EVENTS.initial
		]
		window.addEventListener('URLChange', ({ url, action }: UrlChangeEvent) => {
			if ( 
				this.value[0].href !== url.href ||
				this.value[1] !== action
			) {
				this.value = [
					url,
					action,
					[
						this.value[0],
						this.value[1]
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
		this.value[0] = new URL(this.value[0]);
		if ( this.value[2] ) {
			this.value[2][0] = new URL(this.value[2][0])
		}
		return this.value
	}
}
 
// eslint-disable-next-line import/no-anonymous-default-export
export default new NotificationStore();
