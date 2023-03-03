import { Box, Button, Flex, Heading, Link, Stack, Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = () => {
	const [variables, setVariables] = useState({ limit: 10, cursor: null as null | string });
	const [{ data, fetching }] = usePostsQuery({ variables });

	if (!fetching && !data) {
		return <div>Something went wrong</div>;
	}

	if (!data && fetching) {
		return <div>Loading...</div>;
	}

	return (
		<Layout>
			<Flex alignItems="end">
				<Heading>redditClone</Heading>
				<Link href="/create-post" style={{ marginLeft: 'auto' }}>
					Create Post
				</Link>
			</Flex>
			<Stack spacing={8} mt={4}>
				{data.posts.map(post => {
					return (
						<Box key={post.id} p="5" shadow="md" borderWidth="1px">
							<Heading fontSize="xl">{post.title}</Heading>
							<Text mt={4}>{post.textSnippet}</Text>
						</Box>
					);
				})}
			</Stack>
			{data && (
				<Flex>
					<Button
						isLoading={fetching}
						m="auto"
						my="8"
						onClick={() => {
							setVariables(() => {
								return {
									limit: 10,
									cursor: data.posts[data.posts.length - 1].createdAt,
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

export default withUrqlClient(createUrqlClient, { ssr: true, neverSuspend: true })(Index);
