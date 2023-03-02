import React from 'react';
import { Form, Formik } from 'formik';
import { Box, Button, Flex } from '@chakra-ui/react';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import Link from 'next/link';

interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
	const [, login] = useLoginMutation();
	const router = useRouter();
	return (
		<Wrapper variant="small">
			<Formik
				initialValues={{ usernameOrEmail: '', password: '' }}
				onSubmit={async (values, { setErrors }) => {
					const response = await login(values);
					if (response.data?.login.errors) {
						setErrors(toErrorMap(response.data.login.errors));
					} else if (response.data?.login.user) {
						router.push(router.query.next ? router.query.next.toString() : '/');
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<Box>
							<InputField
								name="usernameOrEmail"
								label="Username or E-Mail:"
								placeholder="Username or Email"
							/>
						</Box>
						<Box mt={4}>
							<InputField name="password" label="Password:" placeholder="Password" type="password" />
						</Box>
						<Flex justifyContent="space-between">
							<Button mt={4} type="submit" isLoading={isSubmitting} variant="outline" color="teal">
								Login
							</Button>
							<Button mt={4} color="tomato" variant="outline">
								<Link href="/forgot-password">Forgot Password</Link>
							</Button>
						</Flex>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default withUrqlClient(createUrqlClient)(Login);
