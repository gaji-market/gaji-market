import React from 'react';
import { memo } from 'react';
import styled from 'styled-components';
import { PRIMARY_COLOR } from './commonColor';

function InputTitle({
  title,
  subTitle,
  isVaild,
  signUpSubTitle,
  isRequired = false,
}) {
  return (
    <>
      {isRequired && <Asterisk>*</Asterisk>}
      <Title>{title}</Title>
      {subTitle && <SubTitle>{subTitle}</SubTitle>}
      {isVaild ? (
        <SignUpSubTitle display='none' color='gray'>
          {signUpSubTitle}
        </SignUpSubTitle>
      ) : (
        <SignUpSubTitle color='#E8828D'>{signUpSubTitle}</SignUpSubTitle>
      )}
    </>
  );
}

export default memo(InputTitle);

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
const SignUpSubTitle = styled.span`
  font-size: 10px;
  display: ${(props) => props.display};
  color: ${(props) => props.color};
  margin: 25px 0px 0px 10px;
`;
