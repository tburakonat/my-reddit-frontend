import React from 'react';
import { Form, Formik } from 'formik';
import { Box, Button } from '@chakra-ui/react';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface RegisterProps {}

const Register: React.FC<RegisterProps> = ({}) => {
	const [, register] = useRegisterMutation();
	const router = useRouter();
	return (
		<Wrapper variant="small">
			<Formik
				initialValues={{ username: '', password: '' }}
				onSubmit={async (values, { setErrors }) => {
					const response = await register(values);
					if (response.data?.register.errors) {
						setErrors(toErrorMap(response.data.register.errors));
					} else if (response.data?.register.user) {
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
							Register
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default withUrqlClient(createUrqlClient)(Register);
