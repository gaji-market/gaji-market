import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export default function AppBar() {
	return (
		<StyledWrapper>
			<NavLink to='/'>HOME</NavLink>
			<NavLink to='/test'>TEST</NavLink>
			<NavLink to='/login'>Login</NavLink>
		</StyledWrapper>
	);
}

const StyledWrapper = styled.div`
	display: flex;
	column-gap: 16px;
	align-items: center;
	justify-content: end;
	padding: 16px;
	height: 56px;
	border-bottom: 1px solid purple;
`;
