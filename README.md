# React-search-params

`react-search-params` is a simple hook to control current url. Also provides some methods that extend URLSearchParams.

## Features

- Add's urlChange event.
- Has no dependencies. 
- It uses javascript URLSearchParams to parse search.
- Decodes search params into primitive values. (ex: "?productId=10&productName=Apple" will become { product: 10, productName: "Apple" }).
- `react-search-params` doesn't do navigation by itself. This gives the developer the control or the ability to use it's own navigation system. see more in [Usage](##usage)
- [parseParams](###), [parseSearch](###parseSearch) method's that extend URLSearchParams


## Installation

Install using [Yarn](https://yarnpkg.com):

```sh
yarn add @resourge/react-search-params
```

or NPM:

```sh
npm install @resourge/react-search-params --save
```

## Usage

```Typescript
const [params, setParams] = useSearchParams(
  // Method to control navigation
  ({ url }) => window.history.replaceState(null, '', url.href),
  // Ex: react-router ({ url }) => history.replace(url.href),
  { }, // default params
  { } // config
)
```

## Quickstart

```jsx
import React from 'react';
import { useSearchParams } from '@resourge/react-search-params';

export default function Form() {
  const [params, setParams] = useSearchParams(
    ({ url }) => window.history.replaceState(null, '', url.href)
  )

  return (
    <div> 
	  App
      <button onClick={() => setParams({ productId: Math.random() })}>
        Set new params
      </button>
	</div>
  );
}
```

### Config

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| **navigate** | `(config: SearchParams<T>) => void` | true | Method to navigate. |
| **defaultParams** | `object` | false | To define default values |
| **config** | `{ hash?: boolean }` | false | When hash is true it will use `URL hash` instead of `URL` to get `search` |

## Methods

### parseParams

Params object into search path

```jsx
import { parseParams } from '@resourge/react-search-params';

parseParams({
  productId: 10,
  productName: 'Apple'
})
// ?productId=10&productName=Apple
```

### parseSearch

Converts search string into object.

```jsx
import { parseSearch } from '@resourge/react-search-params';

parseSearch('?productId=10&productName=Apple')
// {
//   productId: 10,
//   productName: 'Apple'
// }
```

## License

MIT Licensed.