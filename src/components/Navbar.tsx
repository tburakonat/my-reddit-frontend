import { Box, Button, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useMeQuery } from '../generated/graphql';

const Navbar = () => {
	const [{ data, fetching }] = useMeQuery();
	return (
		<Flex bg="tomato" p={4}>
			{fetching ? null : data?.me ? (
				<>
					<Box mr="auto">Welcome {data.me.username}</Box>
					<Box>
						<Button variant="link">Logout</Button>
					</Box>
				</>
			) : (
				<Box ml="auto">
					<NextLink href="/login">
						<Link mr={2}>Login</Link>
					</NextLink>
					<NextLink href="/register">
						<Link href="/register">Register</Link>
					</NextLink>
				</Box>
			)}
		</Flex>
	);
};

export default Navbar;
