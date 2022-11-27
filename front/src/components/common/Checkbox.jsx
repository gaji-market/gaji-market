import React from 'react';
import styled from 'styled-components';
import { PRIMARY_COLOR } from './commonColor';

export default function CheckBox({ title, id, width }) {
  return (
    <Container width={width}>
      <Label htmlFor={id}>{title}</Label>
      <Check id={id} />
    </Container>
  );
}

const Container = styled.div`
  width: ${({ width }) => width};
  margin-left: 10px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 700;
`;

const Check = styled.input.attrs((props) => ({
  type: 'checkbox',
  id: props.id,
}))`
  accent-color: ${PRIMARY_COLOR};
`;
