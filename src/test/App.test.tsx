import { render, screen } from '@testing-library/react'

import App from 'src/App'

it('App', () => {
	render(
		<App />
	)
	
	expect(screen.getByText('App')).toBeInTheDocument()
})

/*
const object1 = {
	test: 1,
	test2: true,
	test3: [1, 2, 3],
	test4: {
		test: 2,
		test2: false
	},
	test5: [{
		test: 2,
		test2: false,
		test3: {
			test: 1,
			test2: true,
			test3: [1, 2, 3],
			test4: {
				test: 2,
				test2: false
			},
			test5: [{
				test: 2,
				test2: false
			}]
		}
	}],
	test6: () => {},
	test7: new Map([['test', 1]]),
	test8: new Set(['test', 1])
}

const stringParam = paramsToString(object1).toString()

console.log('stringParam', stringParam)

const objectParam = paramsToObject(stringParam)
console.log('paramToObject', JSON.stringify(objectParam, null, 4))
function replacer(key: string, value: any) {
	return toIgnore(value) ? undefined : value;
}
console.log('a', JSON.parse(JSON.stringify(object1, replacer)))
console.log('object1 === objectParam', dequal(JSON.parse(JSON.stringify(object1, replacer)), objectParam))
*/
