import React from 'react';
import { Form, Formik } from 'formik';
import { Box, Button } from '@chakra-ui/react';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';

interface RegisterProps {}

const Register: React.FC<RegisterProps> = ({}) => {
	return (
		<Wrapper variant="small">
			<Formik initialValues={{ username: '', password: '' }} onSubmit={values => console.log(values)}>
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
