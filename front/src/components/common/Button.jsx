import React from 'react';
import styled, { css } from 'styled-components';
import { PRIMARY_COLOR, WHITE_COLOR, SUB_COLOR, GRAY_COLOR } from './commonColor';

const BUTTON_SIZE = {
  sm: '100px',
  md: '200px',
  lg: '400px',
};

export default function Button({
  children,
  customSize,
  isOutline,
  isDisabled,
  onClick,
  type = 'button',
  size = 'md',
  isDarkColor = false,
}) {
  return (
    <ButtonStyles
      type={type}
      isOutline={isOutline}
      size={size}
      customSize={customSize}
      isDarkColor={isDarkColor}
      disabled={isDisabled}
      onClick={onClick}
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
    return css`
      width: ${BUTTON_SIZE[size]};
    `;
  }};

  width: ${({ customSize }) => customSize};

  &:disabled {
    background: ${GRAY_COLOR};
    border: 3px solid ${GRAY_COLOR};
    &:hover {
      background: ${GRAY_COLOR};
      border: 3px solid ${GRAY_COLOR};
      cursor: not-allowed;
    }
  }

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
