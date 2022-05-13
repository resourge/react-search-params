import { createLocation, useSearchParams, createPath, parseParams, parseSearch } from './lib'

function App() {
	const [params, setParams] = useSearchParams(
		({ location }) => window.history.replaceState(null, '', location.path)
	)
	console.log('params', params)

	const searchLocation = createLocation('/products?productId=10#hash');
	console.log('createPath', createPath(searchLocation));
	console.log('createLocation', createLocation('/products?productId=10#hash'));
	
	console.log('parseParams', parseParams({
		productId: 10,
		productName: 'Apple'
	}));
	console.log('parseSearch', parseSearch('?productId=10&productName=Apple'));

	return (
		<div>
			App
			<button onClick={() => setParams({ test: Math.random(), test2: Math.random() })}>
				Change
			</button>
			<button onClick={() => {
				window.history.pushState(null, '', `/?test=${Math.random()}&test2=${Math.random()}`);
			}}>
				Push State
			</button>
			<button onClick={() => {
				window.history.back();
			}}>
				Go
			</button>
		</div>
	)
}

export default App
