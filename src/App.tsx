import { useUrl } from './lib'

function App() {
	const [url, action, previousUrl] = useUrl();

	console.log('url', url); 
	console.log('action', action); 
	console.log('previousUrl', previousUrl)

	return (
		<div>
			App
			<button onClick={() => {
				window.history.pushState(null, '', Math.random().toString())
			}}
			>
				Test
			</button>
		</div>
	)
}

export default App
