import { Box, Button, Flex } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';

const Navbar = () => {
	const [{ data, fetching }] = useMeQuery();
	const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
	return (
		<Flex bg="tomato" p={4} position="sticky" top="0" zIndex="1">
			{fetching ? null : data?.me ? (
				<>
					<Box mr="auto">Welcome {data.me.username}</Box>
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
				<Box ml="auto">
					<NextLink style={{ marginRight: '10px' }} href="/login">
						Login
					</NextLink>
					<NextLink href="/register">Register</NextLink>
				</Box>
			)}
		</Flex>
	);
};

export default Navbar;
