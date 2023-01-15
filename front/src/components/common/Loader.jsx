import React from 'react';
import styled from 'styled-components';
import {
  PRIMARY_COLOR,
  PRIMARY_VAR_COLOR,
  SECONDARY_COLOR,
  SECONDARY_VAR_COLOR,
} from './commonColor';

export default function Loader() {
  return (
    <Container>
      <div className='wrapper'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  z-index: 10000000;
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;

  .wrapper {
    position: relative;

    div {
      position: absolute;
      width: 13px;
      height: 13px;
      border-radius: 50%;
      animation-timing-function: cubic-bezier(0, 1, 1, 0);

      &:nth-child(1) {
        background-color: ${PRIMARY_COLOR};
        left: 8px;
        animation: first 0.6s infinite;
      }
      &:nth-child(2) {
        background-color: ${PRIMARY_VAR_COLOR};
        left: 8px;
        animation: second 0.6s infinite;
      }
      &:nth-child(3) {
        background-color: ${SECONDARY_COLOR};
        left: 32px;
        animation: second 0.6s infinite;
      }
      &:nth-child(4) {
        background-color: ${SECONDARY_VAR_COLOR};
        left: 56px;
        animation: third 0.6s infinite;
      }
    }
  }

  @keyframes first {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes second {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(24px, 0);
    }
  }

  @keyframes third {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }
`;
