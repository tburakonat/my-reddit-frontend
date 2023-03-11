import React from 'react';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { useRouter } from 'next/router';
import { usePostQuery } from '../../generated/graphql';
import { Layout } from '../../components/Layout';
import { Heading } from '@chakra-ui/react';

interface PostProps {}

const Post: React.FC<PostProps> = ({}) => {
	const router = useRouter();
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
				<div>
					<Heading mb="4">{data.post.title}</Heading>
					<div>{data.post.text}</div>
					<div>{data.post.author.username}</div>
					<div>{data.post.createdAt}</div>
					<div>{data.post.points}</div>
				</div>
			</div>
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
