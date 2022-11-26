import React from 'react';
import styled from 'styled-components';
import { PRIMARY_COLOR } from './commonColor';

const TEMP_COLOR = '#aaa';

export default function InputTextBox({
  width,
  type,
  placeholder,
  placeholderPosition = 'left',
}) {
  return (
    <Container>
      <Input
        width={width}
        type={type}
        placeholder={placeholder}
        placeholderPosition={placeholderPosition}
      />
    </Container>
  );
}

const Container = styled.div`
  margin-top: 8px;
`;

const Input = styled.input`
  width : 200px;
  width: ${({ width }) => width};

  border-radius: 5px;
  padding: 8px;
  border: 2px solid ${TEMP_COLOR};
  transition: all 0.2s;

  &:focus {
    outline: none;
    border: 2px solid ${PRIMARY_COLOR};
  }

  &::placeholder {
    color: ${TEMP_COLOR};
    text-align: ${({ placeholderPosition }) => placeholderPosition}
`;
