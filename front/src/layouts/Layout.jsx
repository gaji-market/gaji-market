import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
export default function Layout() {
	return (
		<Container>
			<Outlet />
		</Container>
	);
}

const Container = styled.div`
	background: #f8f8f8;
	width: 1200px;
	margin: 0 auto;
	min-height: 91vh;
`;
