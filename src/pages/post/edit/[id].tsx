import React from 'react';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { Flex, Button, Box } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/router';
import InputField from '../../../components/InputField';
import { Layout } from '../../../components/Layout';
import { usePostQuery, useUpdatePostMutation } from '../../../generated/graphql';
import { useGetPostFromUrl } from '../../../utils/useGetPostFromUrl';
import { useGetIntId } from '../../../utils/useGetIntId';
import { toErrorMap } from '../../../utils/toErrorMap';

interface EditPostProps {}

const EditPost: React.FC<EditPostProps> = ({}) => {
	const router = useRouter();
	const intId = useGetIntId();
	const [{ data, fetching, error }] = usePostQuery({
		pause: intId === -1,
		variables: {
			id: intId,
		},
	});
	const [, updatePost] = useUpdatePostMutation();

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
		<Layout variant="small">
			<Formik
				initialValues={{ title: data.post.title, text: data.post.text }}
				onSubmit={async values => {
					const { error } = await updatePost({
						updatePostId: intId,
						title: values.title,
						text: values.text,
					});

					if (!error) {
						router.back();
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<Box>
							<InputField name="title" label="Title" placeholder="title" />
						</Box>
						<Box mt={4}>
							<InputField name="text" label="Body" placeholder="text..." textArea />
						</Box>
						<Flex justifyContent="space-between">
							<Button mt={4} type="submit" isLoading={isSubmitting} variant="outline" color="teal">
								Update Post
							</Button>
						</Flex>
					</Form>
				)}
			</Formik>
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient)(EditPost);
