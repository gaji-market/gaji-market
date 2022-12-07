import React from 'react';
import styled, { keyframes } from 'styled-components';

export default function SkeletonCard() {
  return (
    <Card>
      <Content />
    </Card>
  );
}

const LoadingAnimation = keyframes`
  0% {
    transform: rotate(30deg) translateX(0px);
  }
  50% {
    transform: rotate(30deg) translateX(220px);
  }
  100% {
    transform: rotate(30deg) translateX(340px);
  }
`;

const Card = styled.div`
  margin: 8px;
  width: 240px;
  box-shadow: 1px 1px 5px #d5c7e780;
  border-radius: 10px;

  overflow: hidden;
  position: relative;

  &:before {
    content: 'loading...';
    position: absolute;
    top: 44%;
    left: 50%;
    right: 25%;
    transform: translateX(-50%);
    z-index: 5;
    color: #d5c7e7;
  }
`;

const Content = styled.div`
  width: 100%;
  height: 320px;
  background-color: #e8e5ec70;
  border-radius: 5px;

  overflow: hidden;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    width: 80px;
    height: 200%;
    background: linear-gradient(
      to left,
      #ffffff20,
      #ffffff50,
      #ffffff80,
      #ffffff50,
      #ffffff20
    );
    transform: rotate(10deg);
    left: -20px;
    top: -200px;

    animation: ${LoadingAnimation} infinite 1.2s linear;
  }
`;
