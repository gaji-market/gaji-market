import React from 'react';
import styled from 'styled-components';
import { PRIMARY_COLOR} from './commonColor';

export default function InputBox({ title, placeholder, subTitle, value, setVaule, clickHandler, id, type }) {
  return (
    <>
      <Text>
        <InputTitle htmlFor={id}>
          <StarIcon>*</StarIcon>
          {title}
        </InputTitle>
        <InputSubTitle>{subTitle}</InputSubTitle>
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

  &:focus {
    outline: 1px solid ${PRIMARY_COLOR};
  }
 &::placeholder {
  padding-left:6px;
  font-size:8px;
  color:#cccccc;
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
  color: gray;
  margin: 25px 0px 0px 10px;
`;
