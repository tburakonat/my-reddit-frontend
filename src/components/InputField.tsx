import { FormControl, FormErrorMessage, FormLabel, Input, Textarea } from '@chakra-ui/react';
import { FieldHookConfig, useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
	name: string;
	label: string;
	textArea?: boolean;
};

const InputField: React.FC<InputFieldProps> = ({ label, size: _, textArea, ...props }) => {
	let InputOrTextarea;
	if (textArea) {
		InputOrTextarea = Textarea;
	} else {
		InputOrTextarea = Input;
	}

	const [field, { error }] = useField(props);
	return (
		<FormControl isInvalid={!!error}>
			<FormLabel htmlFor={field.name}>{label}</FormLabel>
			<InputOrTextarea
				{...field}
				{...props}
				value={field.value}
				id={field.name}
				placeholder={props.placeholder}
				onChange={field.onChange}
			/>
			{error && <FormErrorMessage>{error}</FormErrorMessage>}
		</FormControl>
	);
};

export default InputField;
