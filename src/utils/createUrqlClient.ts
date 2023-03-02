import { dedupExchange, Exchange, fetchExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import { pipe, tap } from 'wonka';
import Router from 'next/router';

const errorExchange: Exchange =
	({ forward }) =>
	ops$ => {
		return pipe(
			forward(ops$),
			tap(({ error }) => {
				if (error?.message.includes('Not authenticated')) {
					console.log('User not authenticated');
					Router.replace('/login');
				}
			})
		);
	};

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
		errorExchange,
		ssrExchange,
		fetchExchange,
	],
});
