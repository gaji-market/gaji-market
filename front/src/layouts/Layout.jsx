import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import AppBar from 'layouts/AppBar';
import SideBar from './SideBar';
import Footer from 'components/common/Footer';

export default function Layout() {
  return (
    <>
      <AppBar />
      <SideBar />
      <Container>
        <Outlet />
        <Footer />
      </Container>
    </>
  );
}

const Container = styled.div`
  width: 1200px;
  margin: 0 auto;
  /* height: calc(100vh - 56px); */
`;
