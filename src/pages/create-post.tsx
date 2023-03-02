import { Box, Button, Flex } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import InputField from '../components/InputField';
import { Layout } from '../components/Layout';
import { useCreatePostMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useIsAuth } from '../utils/useIsAuth';

const CreatePost: React.FC<{}> = ({}) => {
	const [, createPost] = useCreatePostMutation();
	const router = useRouter();
	useIsAuth();

	return (
		<Layout variant="small">
			<Formik
				initialValues={{ title: '', text: '' }}
				onSubmit={async (values, { setErrors }) => {
					console.log(values);
					const { error } = await createPost({ title: values.title, text: values.text });
					if (!error) {
						router.push('/');
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
								Create Post
							</Button>
						</Flex>
					</Form>
				)}
			</Formik>
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient)(CreatePost);
