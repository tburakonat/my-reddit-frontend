import { Box, Heading, Link, Stack, Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { Layout } from '../components/Layout';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = () => {
	const [{ data }] = usePostsQuery({ variables: { limit: 10, cursor: null } });
	return (
		<Layout>
			<Link href="/create-post">Create Post</Link>
			<div>Hello World</div>
			<br />
			<Stack spacing={8}>
				{!data
					? null
					: data.posts.map(post => {
							return (
								<Box key={post.id} p="5" shadow="md" borderWidth="1px">
									<Heading fontSize="xl">{post.title}</Heading>
									<Text mt={4}>{post.text}</Text>
								</Box>
							);
					  })}
			</Stack>
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: true, neverSuspend: true })(Index);
