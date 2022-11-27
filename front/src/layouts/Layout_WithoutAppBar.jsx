import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
export default function Layout_WithoutAppBar() {
  return (
    <Container>
      <Outlet />
    </Container>
  );
}

const Container = styled.div`
  width: 1200px;
  margin: 0 auto;
`;
