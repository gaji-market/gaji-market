import React, { memo } from 'react';
import styled from 'styled-components';
import { GRAY_COLOR, PRIMARY_COLOR, WHITE_COLOR } from './commonColor';

function CheckBox({
  title,
  id,
  width,
  onChange,
  onClick,
  isChecked,
  checkBoxWidth,
  checkBoxHeight,
  marginRight,
}) {
  return (
    <Container marginRight={marginRight} width={width}>
      <Label htmlFor={id}>{title}</Label>
      <Check
        onClick={onClick}
        onChange={onChange}
        checked={isChecked}
        width={checkBoxWidth}
        height={checkBoxHeight}
        id={id}
      />
    </Container>
  );
}

export default memo(CheckBox);

const Container = styled.div`
  width: ${({ width }) => width};
  margin-left: 10px;
  margin-top: 5px;
  margin-right: ${({ marginRight }) => marginRight};
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 700;
  vertical-align: super;
`;

const Check = styled.input.attrs((props) => ({
  type: 'checkbox',
  id: props.id,
}))`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 4px;
  cursor: pointer;
  accent-color: ${PRIMARY_COLOR};
  outline: 2px solid ${GRAY_COLOR};
  outline-style: auto;

  width: 20px;
  height: 20px;
  width: ${({ width }) => width};
  height: ${({ heigth }) => heigth};

  transition: all 0.1s;

  &:after {
    border: solid ${WHITE_COLOR};
    border-width: 0 3px 3px 0;
    content: '';
    display: none;
    height: 50%;
    left: 37%;
    position: relative;
    top: 10%;
    transform: rotate(45deg);
    width: 15%;
  }

  &:checked {
    background: ${PRIMARY_COLOR};
    outline: none;
  }

  &:checked:after {
    display: block;
  }
`;
