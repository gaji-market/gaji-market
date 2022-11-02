import React from 'react';
import styled, { css } from 'styled-components';
import { PRIMARY_COLOR, WHITE_COLOR, SUB_COLOR } from './commonColor';

export default function Button({
  children,
  customSize,
  isOutline,
  size = 'md',
  isDarkColor = false,
}) {
  return (
    <ButtonStyles
      isOutline={isOutline}
      size={size}
      customSize={customSize}
      isDarkColor={isDarkColor}
    >
      {children}
    </ButtonStyles>
  );
}

const ButtonStyles = styled.button`
  background: ${PRIMARY_COLOR};
  border: 3px solid ${PRIMARY_COLOR};
  color: ${WHITE_COLOR};
  cursor: pointer;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  padding: 8px;
  transition: all 0.2s;

  ${({ isDarkColor }) =>
    isDarkColor &&
    css`
      background: ${SUB_COLOR};
      border: 3px solid ${SUB_COLOR};
    `}

  ${({ isOutline }) =>
    isOutline &&
    css`
      background: ${WHITE_COLOR};
      color: ${PRIMARY_COLOR};
    `}

  ${({ isOutline, isDarkColor }) =>
    isOutline &&
    isDarkColor &&
    css`
      background: ${WHITE_COLOR};
      color: ${SUB_COLOR};
      border: 3px solid ${SUB_COLOR};
    `}

  ${({ size }) => {
    if (size === 'sm') {
      return css`
        width: 100px;
      `;
    } else if (size === 'md') {
      return css`
        width: 200px;
      `;
    } else if (size === 'lg') {
      return css`
        width: 400px;
      `;
    }
  }};

  width: ${({ customSize }) => customSize};

  &:hover {
    background: ${({ isOutline }) => (isOutline ? '#E9DCFF50' : '#843DE0')};
    border: ${({ isOutline }) => !isOutline && '3px solid #843DE0'};

    background: ${({ isDarkColor }) => isDarkColor && '#222222'};
    border: ${({ isDarkColor }) => isDarkColor && '3px solid #222222'};
    color: ${({ isDarkColor }) => isDarkColor && `${WHITE_COLOR}`};

    background: ${({ isDarkColor, isOutline }) => isDarkColor && isOutline && '#F3F3F3'};
    color: ${({ isDarkColor, isOutline }) => isDarkColor && isOutline && `${SUB_COLOR}`};
  }
`;
