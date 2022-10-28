import React from 'react';
import { Outlet } from 'react-router-dom';
import AppBar from './AppBar';
import styled from 'styled-components';
export default function Layout() {
	return (
		<>
			<AppBar />
			<Container>
				<Outlet />
			</Container>
		</>
	);
}

const Container = styled.div`
	width: 1200px;
	margin: 0 auto;
	height: calc(100vh - 56px);
`;
