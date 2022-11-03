import React from 'react';
import styled from 'styled-components';

export default function InputBox({ title, placeholder, subTitle, value, setVaule, clickHandler }) {
  return (
    <>
      <Text>
        <InputTitle>
          <StarIcon>*</StarIcon>
          {title}
        </InputTitle>
        <InputSubTitle>{subTitle}</InputSubTitle>
      </Text>
      <Input
        onClick={clickHandler}
        value={value}
        onChange={(e) => setVaule(e.target.value)}
        placeholder={`Enter User ${placeholder}`}
      />
    </>
  );
}

const Input = styled.input`
  width: 500px;
  height: 25px;
  border-radius: 5px;
  border: 1px solid gray;

  &:focus {
    outline: 1px solid purple;
  }
`;
const StarIcon = styled.span`
  color: purple;
  margin-right: 5px;
`;
const InputTitle = styled.div`
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
