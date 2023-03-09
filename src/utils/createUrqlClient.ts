import { dedupExchange, Exchange, fetchExchange, stringifyVariables } from 'urql';
import { cacheExchange, Resolver } from '@urql/exchange-graphcache';
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

const simplePagination = (): Resolver<any, any, any> => {
	return (_parent, fieldArgs, cache, info) => {
		const { parentKey: entityKey, fieldName } = info;
		// entityKey = Query
		// fieldName = posts

		const allFields = cache.inspectFields(entityKey);

		const fieldInfos = allFields.filter(info => info.fieldName === fieldName);
		const size = fieldInfos.length;
		if (size === 0) {
			return undefined;
		}

		const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`; // posts({"limit":10})
		const isItInTheCache = cache.resolve(cache.resolve(entityKey, fieldKey) as string, 'posts');
		info.partial = !isItInTheCache;

		const results: string[] = [];
		let hasMore = true;
		fieldInfos.forEach(fi => {
			const key = cache.resolve(entityKey, fi.fieldKey) as string;
			const data = cache.resolve(key, 'posts') as string[];
			const _hasMore = cache.resolve(key, 'hasMore') as boolean;
			if (!_hasMore) {
				hasMore = _hasMore as boolean;
			}
			results.push(...data);
		});

		return {
			__typename: 'PaginatedPosts',
			hasMore,
			posts: results,
		};
	};
};

export const createUrqlClient = (ssrExchange: any) => ({
	url: 'http://localhost:4000/graphql',
	fetchOptions: { credentials: 'include' as const },
	exchanges: [
		dedupExchange,
		cacheExchange({
			keys: {
				PaginatedPosts: () => null,
			},
			resolvers: {
				Query: {
					posts: simplePagination(),
				},
			},
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
					createPost: (_result, _args, cache, _info) => {
						cache.invalidate('Query', 'posts', {
							limit: 15,
							cursor: null,
						});
					},
				},
			},
		}),
		errorExchange,
		ssrExchange,
		fetchExchange,
	],
});
