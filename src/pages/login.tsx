import React from 'react';
import { Form, Formik } from 'formik';
import { Box, Button } from '@chakra-ui/react';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';

interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
	const [, login] = useLoginMutation();
	const router = useRouter();
	return (
		<Wrapper variant="small">
			<Formik
				initialValues={{ username: '', password: '' }}
				onSubmit={async (values, { setErrors }) => {
					const response = await login(values);
					if (response.data?.login.errors) {
						setErrors(toErrorMap(response.data.login.errors));
					} else if (response.data?.login.user) {
						router.push('/');
					}
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
						<Button mt={4} type="submit" isLoading={isSubmitting} variant="outline" color="teal">
							Login
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default Login;
