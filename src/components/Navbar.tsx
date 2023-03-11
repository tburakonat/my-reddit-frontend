import { Box, Button, Flex } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';

const Navbar = () => {
	const [{ data, fetching }] = useMeQuery();
	const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
	const siteName = (
		<NextLink href="/">
			<Box>redditClone</Box>
		</NextLink>
	);

	return (
		<Flex bg="tomato" p={4} position="sticky" top="0" zIndex="1">
			{fetching ? null : data?.me ? (
				<>
					{siteName}
					<NextLink href="/create-post" style={{ marginInline: 'auto' }}>
						Create Post
					</NextLink>
					<Box mr="10px">{data.me.username}</Box>
					<Box>
						<Button
							variant="link"
							// @ts-ignore
							onClick={() => logout()}
							isLoading={logoutFetching}
						>
							Logout
						</Button>
					</Box>
				</>
			) : (
				<>
					{siteName}
					<Box ml="auto">
						<NextLink style={{ marginRight: '10px' }} href="/login">
							Login
						</NextLink>
						<NextLink href="/register">Register</NextLink>
					</Box>
				</>
			)}
		</Flex>
	);
};

export default Navbar;
