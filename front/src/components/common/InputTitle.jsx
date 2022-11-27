import React from 'react';
import styled from 'styled-components';
import { PRIMARY_COLOR } from './commonColor';

export default function InputTitle({ title, subTitle, isRequired = false }) {
  return (
    <>
      {isRequired && <Asterisk>*</Asterisk>}
      <Title>{title}</Title>
      {subTitle && <SubTitle>{subTitle}</SubTitle>}
    </>
  );
}
const Asterisk = styled.span`
  font-weight: 900;
  margin-right: 10px;
  color: ${PRIMARY_COLOR};
`;

const Title = styled.span`
  font-weight: 700;
  margin-top: 10px;
`;

const SubTitle = styled.span`
  margin-left: 8px;
  font-size: 12px;
  color: #aaa;
`;
