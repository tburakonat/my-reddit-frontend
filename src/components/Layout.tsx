import React from 'react';
import Navbar from './Navbar';
import Wrapper, { WrapperVariant } from './Wrapper';

interface LayoutProps {
	children: React.ReactNode;
	variant?: WrapperVariant;
}

export const Layout: React.FC<LayoutProps> = ({ variant, children }) => {
	return (
		<>
			<Navbar />
			<Wrapper variant={variant}>{children}</Wrapper>
		</>
	);
};
