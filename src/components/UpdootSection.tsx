import { TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons';
import { Flex, Icon, IconButton, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';

interface UpdootSectionProps {
	post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
	const [{ fetching, operation }, vote] = useVoteMutation();
	const [loadingState, setLoadingState] = useState<'updoot-loading' | 'downdoot-loading' | 'not-loading'>(
		'not-loading'
	);

	return (
		<Flex flexDir="column" justifyContent="space-between" alignItems="center" marginRight="20px">
			<IconButton
				aria-label="updoot post"
				icon={<Icon as={TriangleUpIcon} />}
				variant="link"
				size="md"
				color={post.voteStatus === 1 ? 'tomato' : undefined}
				onClick={async () => {
					setLoadingState('updoot-loading');
					await vote({ postId: post.id, value: 1 });
					setLoadingState('not-loading');
				}}
				isLoading={loadingState === 'updoot-loading'}
			/>
			<Text>{post.points}</Text>
			<IconButton
				aria-label="downdoot post"
				icon={<Icon as={TriangleDownIcon} />}
				variant="link"
				size="md"
				color={post.voteStatus === -1 ? 'blue.500' : undefined}
				onClick={async () => {
					setLoadingState('downdoot-loading');
					await vote({ postId: post.id, value: -1 });
					setLoadingState('not-loading');
				}}
				isLoading={loadingState === 'downdoot-loading'}
			/>
		</Flex>
	);
};
