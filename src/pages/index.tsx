import { Box, Button, Flex, Heading, Link, Stack, Text, IconButton } from '@chakra-ui/react';
import { Icon, TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons';
import { withUrqlClient } from 'next-urql';
import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { UpdootSection } from '../components/UpdootSection';

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
			<Flex alignItems="end">
				<Heading>redditClone</Heading>
				<Link href="/create-post" style={{ marginLeft: 'auto' }}>
					Create Post
				</Link>
			</Flex>
			<Stack spacing={8} my={4}>
				{data.posts.posts.map(post => {
					return (
						<Box key={post.id} p="5" shadow="md" borderWidth="1px">
							<Flex>
								<UpdootSection post={post} />
								<Box>
									<Heading fontSize="xl">{post.title}</Heading>
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
