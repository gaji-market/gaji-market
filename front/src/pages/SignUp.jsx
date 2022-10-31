import InputBox from 'components/common/InputBox';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import styled from 'styled-components';

export default function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [nickName, setNickName] = useState("")

  useEffect(() => {
    console.log(email)
  }, [email])

  function ChangeHander(e) {
    console.log(e.target.value)
  }
  return <Container>
    <SignUpHead>
      <Title>회원가입</Title>
      <SubTitle>가지 마켓에 오신것을 환영합니다! </SubTitle>
    </SignUpHead>
    <Line />
    <Form>
      <InputBox title={"아이디"} placeholder={"Id"} value={email} setVaule={setEmail} />
      <InputBox title={"비밀번호"} placeholder={"PassWord"} value={password} setVaule={setPassword} />
      <InputBox title={"비밀번호 확인"} placeholder={"PassWord"} value={confirmPassword} setVaule={setConfirmPassword} />
      <InputBox title={"닉네임"} placeholder={"NickName"} value={nickName} setVaule={setNickName} />

    </Form>
  </Container>

}
const Container = styled.div`
  width:500px;
  height:calc(100vh - 102px);
  margin:0 auto;
  box-shadow: 0px 0px 10px gray;
  padding:50px 100px ;
  `;
const Title = styled.div`
  font-weight:800;
  font-size:16px;
`
const SubTitle = styled.p`
  margin-left:50px;
  padding-top:7px;
  font-size:10px;
  vertical-align:bottom;
  color:gray;
`
const SignUpHead = styled.div`
  display:flex;
`
const Line = styled.div`
  border: 1px solid gray;
  margin-top:15px;
  width:500px;
`
const Form = styled.form`
`
