import React from 'react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { IconButton, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useDeletePostMutation } from '../generated/graphql';

interface EditDeletePostButtonsProps {
	id: number;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({ id }) => {
	const [, deletePost] = useDeletePostMutation();

	return (
		<>
			<NextLink href="/post/edit/[id]" as={`/post/edit/${id}`} legacyBehavior>
				<IconButton
					as={Link}
					aria-label="edit post"
					icon={<EditIcon />}
					_hover={{ color: 'blue.500' }}
					ml="auto"
					size="sm"
				/>
			</NextLink>
			<IconButton
				aria-label="delete post"
				icon={<DeleteIcon />}
				_hover={{ color: 'red' }}
				ml="10px"
				size="sm"
				onClick={async () => await deletePost({ deletePostId: id })}
			/>
		</>
	);
};
