import React from 'react';
import styled from 'styled-components';
import { PRIMARY_COLOR, GRAY_COLOR } from './commonColor';

export default function InputTextBox({
  width,
  type,
  value,
  clickHandler,
  id,
  containerBottom,
  padding,
  required,
  onChange,
  placeholder,
  placeholderPosition = 'left',
  isReadOnly = false,
}) {
  return (
    <Container width={width} containerBottom={containerBottom}>
      <Input
        onChange={onChange}
        required={required}
        id={id}
        width={width}
        type={type}
        defaultValue={value}
        padding={padding}
        placeholder={placeholder}
        placeholderPosition={placeholderPosition}
        onClick={clickHandler}
        readOnly={isReadOnly}
      />
    </Container>
  );
}

const Container = styled.div`
  margin-top: 8px;
  margin-bottom: ${({ containerBottom }) => containerBottom};
  width: ${({ width }) => width};
`;

const Input = styled.input`
  width: 200px;
  width: ${({ width }) => width};

  border-radius: 8px;
  padding: 8px;
  padding: ${({ padding }) => padding};
  border: 2px solid ${GRAY_COLOR};
  transition: all 0.2s;

  &:focus {
    outline: none;
    border: 2px solid ${PRIMARY_COLOR};
  }

  &::placeholder {
    color: ${GRAY_COLOR};
    text-align: ${({ placeholderPosition }) => placeholderPosition};
  }
`;
