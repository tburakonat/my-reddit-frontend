import { Box, Button, Flex } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useForgotPasswordMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';

const ForgotPassword: React.FC<{}> = ({}) => {
	const router = useRouter();
	const [complete, setComplete] = useState(false);
	const [, forgotPassword] = useForgotPasswordMutation();
	return (
		<Wrapper variant="small">
			<Formik
				initialValues={{ email: '' }}
				onSubmit={async (values, { setErrors }) => {
					await forgotPassword(values);
					setComplete(true);
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<Box mt={4}>
							<InputField name="email" label="Email:" placeholder="Email" type="email" />
						</Box>
						{complete ? (
							<Box mt={4} color="tomato">
								If an account with that email exists, we sent you an email
							</Box>
						) : null}
						<Button mt={4} type="submit" isLoading={isSubmitting} variant="outline" color="teal">
							Send Email
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
