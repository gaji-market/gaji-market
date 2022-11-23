import React from 'react';
import styled from 'styled-components';
import { PRIMARY_COLOR } from './commonColor';

export default function InputBox({
  title,
  placeholder,
  subTitle,
  value,
  setVaule,
  clickHandler,
  id,
  type,
  isVaild,
}) {
  return (
    <>
      <Text>
        <InputTitle htmlFor={id}>
          <StarIcon>*</StarIcon>
          {title}
        </InputTitle>
        {isVaild ? (
          <InputSubTitle color='gray'>{subTitle}</InputSubTitle>
        ) : (
          <InputSubTitle color='#E8828D'>{subTitle}</InputSubTitle>
        )}
      </Text>
      <Input
        type={type}
        onClick={clickHandler}
        value={value}
        id={id}
        onChange={(e) => setVaule(e.target.value)}
        placeholder={`${placeholder}`}
      />
    </>
  );
}

const Input = styled.input`
  width: 500px;
  height: 25px;
  border-radius: 5px;
  border: 1px solid #bbbbbb;
  padding-left: 10px;
  &:focus {
    outline: 1px solid ${PRIMARY_COLOR};
  }
  &::placeholder {
    font-size: 8px;
    color: #cccccc;
  }
`;
const StarIcon = styled.span`
  color: ${PRIMARY_COLOR};
  margin-right: 5px;
`;
const InputTitle = styled.label`
  font-weight: 800;
  margin: 20px 0px 10px 0px;
`;
const Text = styled.div`
  display: flex;
`;
const InputSubTitle = styled.div`
  font-size: 10px;
  color: ${(props) => props.color};
  margin: 25px 0px 0px 10px;
`;
