import { dedupExchange, fetchExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';

export const createUrqlClient = (ssrExchange: any) => ({
	url: 'http://localhost:4000/graphql',
	fetchOptions: { credentials: 'include' as const },
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
		ssrExchange,
		fetchExchange,
	],
});
