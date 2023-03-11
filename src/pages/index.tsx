import { Box, Button, Flex, Heading, Link, Stack, Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { useState } from 'react';
import { Layout } from '../components/Layout';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { UpdootSection } from '../components/UpdootSection';
import NextLink from 'next/link';

const Index = () => {
	const [variables, setVariables] = useState({ limit: 15, cursor: null as null | string });
	const [{ data, fetching }] = usePostsQuery({ variables });

	if (!fetching && !data) {
		return <div>Something went wrong</div>;
	}

	if (!data && fetching) {
		return <div>Loading...</div>;
	}

	return (
		<Layout>
			<Stack spacing={8} mb={4} mt={10}>
				{data.posts.posts.map(post => {
					return (
						<Box key={post.id} p="5" shadow="md" borderWidth="1px">
							<Flex>
								<UpdootSection post={post} />
								<Box>
									<NextLink href="/post/[id]" as={`/post/${post.id}`}>
										<Heading fontSize="xl">{post.title}</Heading>
									</NextLink>
									<Text>posted by {post.author.username}</Text>
									<Text mt={4}>{post.textSnippet}</Text>
								</Box>
							</Flex>
						</Box>
					);
				})}
			</Stack>
			{data && data.posts.hasMore && (
				<Flex>
					<Button
						isLoading={fetching}
						m="auto"
						my="8"
						onClick={() => {
							setVariables(() => {
								return {
									limit: 10,
									cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
								};
							});
						}}
					>
						Load More
					</Button>
				</Flex>
			)}
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
