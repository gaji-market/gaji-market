import React from 'react';
import styled, { css } from 'styled-components';
import { PRIMARY_COLOR, WHITE_COLOR, SUB_COLOR } from './commonColor';

export default function Button({
  children,
  customSize,
  isOutline,
  btnSize = 'md',
  isDarkColor = false,
}) {
  return (
    <ButtonStyles
      isOutline={isOutline}
      btnSize={btnSize}
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

  ${(props) =>
    props.isDarkColor &&
    css`
      background: ${SUB_COLOR};
      border: 3px solid ${SUB_COLOR};
    `}

  ${(props) =>
    props.isOutline &&
    css`
      background: ${WHITE_COLOR};
      color: ${PRIMARY_COLOR};
    `}

  ${(props) =>
    props.isOutline &&
    props.isDarkColor &&
    css`
      background: ${WHITE_COLOR};
      color: ${SUB_COLOR};
      border: 3px solid ${SUB_COLOR};
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
    // 아웃라인 버튼
    background: ${(props) => (props.isOutline ? '#E9DCFF50' : '#843DE0')};
    border: ${(props) => !props.isOutline && '3px solid #843DE0'};

    // 다크그레이 버튼
    background: ${(props) => props.isDarkColor && '#222222'};
    border: ${(props) => props.isDarkColor && '3px solid #222222'};
    color: ${(props) => props.isDarkColor && `${WHITE_COLOR}`};

    // 아웃라인 + 다크그레이 버튼
    background: ${(props) => props.isDarkColor && props.isOutline && '#F3F3F3'};
    color: ${(props) => props.isDarkColor && props.isOutline && `${SUB_COLOR}`};
  }
`;
