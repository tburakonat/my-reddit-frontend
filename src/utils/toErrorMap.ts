export const toErrorMap = (errors: any[]) => {
	const errorMap: Record<string, string> = {};
	errors.forEach(({ field, message }) => {
		errorMap[field] = message;
	});

	return errorMap;
};
