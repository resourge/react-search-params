import { useSearchParams } from './lib'

function App() {
	const [params, setParams] = useSearchParams(
		({ location }) => window.history.replaceState(null, '', location.path)
	)

	console.log('params', params)

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
