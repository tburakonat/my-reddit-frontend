import { ChakraProvider } from '@chakra-ui/react';

import theme from '../theme';
import { AppProps } from 'next/app';
import { Provider, createClient, dedupExchange, fetchExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';

const client = createClient({
	url: 'http://localhost:4000/graphql',
	fetchOptions: { credentials: 'include' },
	exchanges: [
		dedupExchange,
		cacheExchange({
			updates: {
				Mutation: {
					login: (_result, _args, cache, _info) => {
						cache.invalidate('Query', 'me');
					},
					register: (_result, _args, cache, _info) => {
						cache.invalidate('Query', 'me');
					},
					logout: (_result, _args, cache, _info) => {
						cache.invalidate('Query', 'me');
					},
				},
			},
		}),
		fetchExchange,
	],
});

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<Provider value={client}>
			<ChakraProvider theme={theme}>
				<Component {...pageProps} />
			</ChakraProvider>
		</Provider>
	);
}

export default MyApp;
