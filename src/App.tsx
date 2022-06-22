import { useSearchParams } from 'src/lib/hooks/useSearchParams';

function App() {
	const [
		{
			url
		},
		setParams
	] = useSearchParams(
		({ url }) => {
			window.history.replaceState(null, '', url.href)
		},
		{

		},
		{
			hash: true
		}
	)
	
	return (
		<div>
			App
			<button
				onClick={() => {
					setParams({
						test: 1
					})
				}}
			>
				Set Params
			</button>
		</div>
	)
}

export default App
