import React from 'react';
import { Outlet } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

import { PRIMARY_COLOR } from 'components/common/commonColor';

export default function Layout_WithoutAppBar() {
  return (
    <Container>
      <Outlet />
    </Container>
  );
}

const fade = keyframes`
  0% {
    opacity: .1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: .1;
  }
`;

const Container = styled.div`
  width: 100vw;
  margin: 0 auto;
  display: flex;
  jusity-contents: center;
  align-item: center;
  overflow: hidden;

  ::before {
    content: '';
    position: absolute;
    z-index: -15;
    display: block;
    width: 100%;
    height: 100%;
    background: ${PRIMARY_COLOR};
    top: 0;
  }

  ::after {
    content: '';
    // 임시 url
    background: url('https://raw.githubusercontent.com/gaji-market/gaji-market/ef62c8bc4463b0a90b4b80770e275279f713a36c/front/src/assets/bg_pattern.png')
      0px 0px;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: -10;
    opacity: 0.1;
    animation: ${fade} 3s 1s infinite linear;
  }
`;
