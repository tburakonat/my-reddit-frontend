import { withUrqlClient } from 'next-urql';
import Navbar from '../components/Navbar';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = () => {
	const [{ data }] = usePostsQuery();
	return (
		<>
			<Navbar />
			<div>Hello World</div>
			<br />
			{!data ? null : data.posts.map(post => <div key={post.id}>{post.title}</div>)}
		</>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: true, neverSuspend: true })(Index);
