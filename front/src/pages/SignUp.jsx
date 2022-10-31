import React from 'react';
import styled from 'styled-components';

export default function SignUp() {
  return <Container>
    <SignUpHead>
      <Title>회원가입</Title>
      <SubTitle>가지 마켓에 오신것을 환영합니다! </SubTitle>
    </SignUpHead>
  </Container>

}
const Container = styled.div`
  width:600px;
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
  font-size:10px;
  text-align:bottom;
`
const SignUpHead = styled.div`
  display:flex;
`
