import React from 'react';
import styled, { css } from 'styled-components';

export default function Button({
  children,
  customSize,
  isOutline,
  btnSize = 'md',
}) {
  return (
    <ButtonStyles
      isOutline={isOutline}
      btnSize={btnSize}
      customSize={customSize}
    >
      {children}
    </ButtonStyles>
  );
}

const ButtonStyles = styled.button`
  background: #9747ff;
  border: 3px solid #9747ff;
  color: #fff;
  cursor: pointer;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  padding: 8px;
  transition: all 0.2s;

  ${(props) =>
    props.isOutline &&
    css`
      background: #fff;
      color: #9747ff;
    `}

  ${(props) => {
    if (props.btnSize === 'sm') {
      return css`
        width: 100px;
      `;
    } else if (props.btnSize === 'md') {
      return css`
        width: 200px;
      `;
    } else if (props.btnSize === 'lg') {
      return css`
        width: 400px;
      `;
    }
  }};

  width: ${(props) => props.customSize};

  &:hover {
    background: ${(props) => (props.isOutline ? '#E9DCFF50' : '#843DE0')};
    border: ${(props) => !props.isOutline && '3px solid #843DE0'};
  }
`;
