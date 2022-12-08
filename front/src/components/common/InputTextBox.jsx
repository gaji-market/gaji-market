import React from 'react';
import styled from 'styled-components';
import { PRIMARY_COLOR } from './commonColor';

const TEMP_COLOR = '#aaa';

export default function InputTextBox({
  width,
  type,
  value,
  clickHandler,
  id,
  containerBottom,
  padding,
  placeholder,
  placeholderPosition = 'left',
}) {
  return (
    <Container width={width} containerBottom={containerBottom}>
      <Input
        id={id}
        width={width}
        type={type}
        defaultValue={value}
        padding={padding}
        placeholder={placeholder}
        placeholderPosition={placeholderPosition}
        onClick={clickHandler}
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
  border: 2px solid ${TEMP_COLOR};
  transition: all 0.2s;

  &:focus {
    outline: none;
    border: 2px solid ${PRIMARY_COLOR};
  }

  &::placeholder {
    color: ${TEMP_COLOR};
    text-align: ${({ placeholderPosition }) => placeholderPosition};
  }
`;
