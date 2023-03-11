import React from 'react';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { useRouter } from 'next/router';
import { useDeletePostMutation, useMeQuery, usePostQuery } from '../../generated/graphql';
import { Layout } from '../../components/Layout';
import { Box, Button, Flex, Heading, IconButton, Text } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

interface PostProps {}

const Post: React.FC<PostProps> = ({}) => {
	const router = useRouter();
	const [{ data: meData }] = useMeQuery();
	const [, deletePost] = useDeletePostMutation();
	const [{ data, fetching, error }] = usePostQuery({ variables: { id: parseInt(router.query.id.toString()) } });

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
					<Text>{data.post.author.username}</Text>
					<Text>{data.post.createdAt}</Text>
					<Text>{data.post.points}</Text>
				</Box>
				{meData && meData.me && meData.me.id === data.post.author.id && (
					<Flex mt="5">
						<Box ml="auto">
							{/* style this button red when hovered */}
							<Button
								leftIcon={<DeleteIcon />}
								variant="solid"
								_hover={{ color: 'tomato' }}
								onClick={() => deletePost({ deletePostId: data.post.id })}
							>
								Delete
							</Button>
						</Box>
					</Flex>
				)}
			</div>
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
