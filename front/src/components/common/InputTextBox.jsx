import React from 'react';
import styled from 'styled-components';
import { PRIMARY_COLOR, GRAY_COLOR } from './commonColor';

export default function InputTextBox({
  width,
  type,
  padding,
  required,
  onChange,
  placeholder,
  placeholderPosition = 'left',
}) {
  return (
    <Container width={width}>
      <Input
        onChange={onChange}
        required={required}
        width={width}
        type={type}
        padding={padding}
        placeholder={placeholder}
        placeholderPosition={placeholderPosition}
      />
    </Container>
  );
}

const Container = styled.div`
  margin-top: 8px;
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
