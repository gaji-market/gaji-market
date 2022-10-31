import InputBox from 'components/common/InputBox';
import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import DaumPostcodeEmbed, { useDaumPostcodePopup } from 'react-daum-postcode';

export default function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [nickName, setNickName] = useState("")
  const open = useDaumPostcodePopup("https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js");

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }
    console.log(fullAddress)
  };
  function ClickHander() {
    ;
  }

  return <Container>
    <SignUpHead>
      <Title>회원가입</Title>
      <SubTitle>가지 마켓에 오신것을 환영합니다! </SubTitle>
    </SignUpHead>
    <Line />
    <Form>
      <InputBox title={"아이디"} placeholder={"Id"} value={email} setVaule={setEmail} subTitle={"8글자 이상 이여야 합니다"} />
      <InputBox title={"비밀번호"} placeholder={"PassWord"} value={password} setVaule={setPassword} subTitle={"8글자 이상 이고 영어와 숫자가 포함되어야 합니다"} />
      <InputBox title={"비밀번호 확인"} placeholder={"PassWord"} value={confirmPassword} setVaule={setConfirmPassword} subTitle={"위의 비밀번호와 일치하여야 합니다"} />
      <InputBox title={"닉네임"} placeholder={"NickName"} value={nickName} setVaule={setNickName} />
      <InputBox title={"주소"} placeholder={"Address"} value={nickName} setVaule={setNickName} ClickHander={() => open({ onComplete: handleComplete })} subTitle={"주소를 입력하고 싶으면 밑을 누르세요."} />
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
  margin-left:30px;
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
