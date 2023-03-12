import React from 'react';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { useMeQuery } from '../../generated/graphql';
import { Layout } from '../../components/Layout';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';
import { EditDeletePostButtons } from '../../components/EditDeletePostButtons';

interface PostProps {}

const Post: React.FC<PostProps> = ({}) => {
	const [{ data: meData }] = useMeQuery();
	const [{ data, fetching, error }] = useGetPostFromUrl();

	if (fetching) {
		return (
			<Layout>
				<div>loading...</div>
			</Layout>
		);
	}

	if (error) {
		return (
			<Layout>
				<div>{error.message}</div>
			</Layout>
		);
	}

	if (!data?.post) {
		return (
			<Layout>
				<div>Could not find post</div>
			</Layout>
		);
	}

	return (
		<Layout>
			<div>
				<Box>
					<Heading mb="4">{data.post.title}</Heading>
					<Text>{data.post.text}</Text>
					<Text>By: {data.post.author.username}</Text>
					<Text>Points: {data.post.points}</Text>
				</Box>
				{meData && meData.me && meData.me.id === data.post.author.id && (
					<Flex mt="5">
						<EditDeletePostButtons id={data.post.id} />
					</Flex>
				)}
			</div>
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
