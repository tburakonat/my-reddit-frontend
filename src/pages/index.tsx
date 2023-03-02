import { Link } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { Layout } from '../components/Layout';
import Navbar from '../components/Navbar';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = () => {
	const [{ data }] = usePostsQuery();
	return (
		<Layout>
			<Link href="/create-post">Create Post</Link>
			<div>Hello World</div>
			<br />
			{!data ? null : data.posts.map(post => <div key={post.id}>{post.title}</div>)}
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: true, neverSuspend: true })(Index);
