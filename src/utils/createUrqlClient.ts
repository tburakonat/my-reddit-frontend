import { dedupExchange, Exchange, fetchExchange, gql, stringifyVariables } from 'urql';
import { cacheExchange, Resolver } from '@urql/exchange-graphcache';
import { pipe, tap } from 'wonka';
import Router from 'next/router';
import { VoteMutationVariables } from '../generated/graphql';
import { isServer } from './isServer';

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

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
	let cookie = '';
	if (isServer()) {
		cookie = ctx?.req.headers.cookie;
	}

	return {
		url: 'http://localhost:4000/graphql',
		fetchOptions: {
			credentials: 'include' as const,
			headers: cookie ? { cookie } : undefined,
		},
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
						deletePost: (_result, _args, cache, _info) => {
							cache.invalidate('Query', 'posts', { limit: 15 });
						},
						vote: (_result, args, cache, _info) => {
							const { postId, value } = args as VoteMutationVariables;

							const data = cache.readFragment(
								gql`
									fragment _ on PostType {
										id
										points
										voteStatus
									}
								`,
								{ id: postId }
							);

							if (data) {
								// the user has voted on the post before
								// and they are again voting the same way
								// we remove their vote
								if (data.voteStatus === value) {
									cache.writeFragment(
										gql`
											fragment _ on PostType {
												id
												voteStatus
												points
											}
										`,
										{ id: postId, voteStatus: null, points: data.points - value }
									);
								}

								// the user has not voted on the post before
								// we adjust the points by 1
								if (data.voteStatus === null) {
									cache.writeFragment(
										gql`
											fragment _ on PostType {
												id
												voteStatus
												points
											}
										`,
										{ id: postId, voteStatus: value, points: data.points + value }
									);
								}

								// the user has voted on the post before
								// and they are changing their vote
								// we adjust the points by 2
								if (data.voteStatus !== null && data.voteStatus !== value) {
									cache.writeFragment(
										gql`
											fragment _ on PostType {
												id
												voteStatus
												points
											}
										`,
										{ id: postId, voteStatus: value, points: data.points + 2 * value }
									);
								}
							}
						},
						login: (_result, _args, cache, _info) => {
							cache.invalidate('Query', 'posts', { limit: 15 });
							cache.invalidate('Query', 'me');
						},
						register: (_result, _args, cache, _info) => {
							cache.invalidate('Query', 'posts', { limit: 15 });
							cache.invalidate('Query', 'me');
						},
						logout: (_result, _args, cache, _info) => {
							cache.invalidate('Query', 'posts', { limit: 15 });
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
	};
};
