import { Button, Box } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import InputField from '../../components/InputField';
import Wrapper from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';

const ChangePassword: NextPage = () => {
	const [, changePassword] = useChangePasswordMutation();
	const router = useRouter();
	const [tokenError, setTokenError] = React.useState('');

	return (
		<Wrapper variant="small">
			<Formik
				initialValues={{ newPassword: '' }}
				onSubmit={async (values, { setErrors }) => {
					const response = await changePassword({
						token: typeof router.query.token === 'string' ? router.query.token : '',
						newPassword: values.newPassword,
					});
					if (response.data?.changePassword.errors) {
						const errorMap = toErrorMap(response.data.changePassword.errors);
						if ('token' in errorMap) {
							setTokenError(errorMap.token);
						}
						setErrors(errorMap);
					} else if (response.data?.changePassword.user) {
						// worked
						router.push('/');
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<Box>
							<InputField
								name="newPassword"
								label="New Password"
								placeholder="new password"
								type="password"
							/>
						</Box>
						{tokenError ? (
							<Box>
								<Box color="red">{tokenError}</Box>
								<Box>It may have expired. Try resetting your password again.</Box>
							</Box>
						) : null}
						<Button mt={4} type="submit" isLoading={isSubmitting} variant="outline" color="teal">
							Change Password
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
