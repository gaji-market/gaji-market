import React from 'react'
import { useEffect } from 'react';
import styled from 'styled-components';

export default function InputBox({ title, placeholder, subTitle, value, setVaule, ClickHander }) {

  return <>
    <Text>
      <InputTitle><span style={{ color: "purple", marginRight: "5px" }}>*</span>{title}</InputTitle><InputSubTitle>{subTitle}</InputSubTitle>
    </Text>
    <Input onClick={ClickHander} value={value} onChange={e => setVaule(e.target.value)} placeholder={`Enter User ${placeholder}`} />
  </>
}

const Input = styled.input`
    width: 500px;
    height:25px;
    border-radius:5px;
    border: 1px solid gray;
    
    &:focus{
      outline: 1px solid purple;
    }
`
const InputTitle = styled.div`
  font-weight:800;
  margin:20px 0px 10px 0px;
`
const Text = styled.div`
  display:flex;
`
const InputSubTitle = styled.div`
  font-size:10px;
  color:gray;
  margin :25px 0px 0px 10px;
`