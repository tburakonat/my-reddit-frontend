import React from 'react';
import { Form, Formik } from 'formik';
import { Box, Button } from '@chakra-ui/react';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useMutation } from 'urql';

interface RegisterProps {}

const REGISTER_MUTATION = `
mutation Register($username: String!, $password: String!) {
	register(options: { username: $username, password: $password }) {
		user {
			id
			username
		}
		errors {
			field
			message
		}
	}
}
`;

const Register: React.FC<RegisterProps> = ({}) => {
	const [, register] = useMutation(REGISTER_MUTATION);
	return (
		<Wrapper variant="small">
			<Formik
				initialValues={{ username: '', password: '' }}
				onSubmit={async values => {
					const response = await register(values);
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<Box>
							<InputField name="username" label="Username:" placeholder="Username" />
						</Box>
						<Box mt={4}>
							<InputField name="password" label="Password:" placeholder="Password" type="password" />
						</Box>
						<Button type="submit" isLoading={isSubmitting} variant="outline" color="teal">
							Register
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default Register;
