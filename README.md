# @resourge/react-search-params

`@resourge/react-search-params` is a simple hook to control current url. Also provides some methods that extend URLSearchParams.

## Features

- Add's beforeURLChange and URLChange event to native javascript.
- Has no dependencies. 
- It uses javascript URLSearchParams to parse search.
- Decodes search params into primitive values. (ex: "?productId=10&productName=Apple" will become { product: 10, productName: "Apple" }).


## Installation

Install using [Yarn](https://yarnpkg.com):

```sh
yarn add @resourge/react-search-params
```

or NPM:

```sh
npm install @resourge/react-search-params --save
```

## Basic usage

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

## Documentation

### useSearchParams

```Typescript
const [params, setParams] = useSearchParams(
  // Method to control navigation
  ({ url }) => window.history.replaceState(null, '', url.href),
  // Ex: react-router ({ url }) => history.replace(url.href),
  { }, // default params
  { } // config
)
```

#### Config

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| **navigate** | `(config: SearchParams<T>) => void` | true | Method to navigate. |
| **defaultParams** | `object` | false | To define default values |
| **config** | `{ hash?: boolean }` | false | When hash is true it will use `URL hash` instead of `URL` to get `search` |

### useUrl

Returns the current URL object.

```Typescript
const url = useUrl();
```

## License

MIT Licensed.