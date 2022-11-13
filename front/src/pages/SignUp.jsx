import InputBox from 'components/common/InputBox';
import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import getAddress from 'utils/getAddress';
import Button from '../components/common/Button';
import { isVaildId, isVaildPassword, isETCVaild } from 'utils/checkVaildForm';
export default function SignUp() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickName, setNickName] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const open = useDaumPostcodePopup(
    'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
  );
  const isIdVaild = isVaildId(id);
  const isPasswordVaild = isVaildPassword(password);
  const isPasswordConfirmVaild = password === confirmPassword;
  const isNickNameVaild = nickName.length > 4;
  const isFormValid =
    isIdVaild &&
    isPasswordVaild &&
    isNickNameVaild &&
    isPasswordConfirmVaild &&
    isETCVaild(address, addressDetail, birthday, gender);

  const handleComplete = (data) => {
    const fullAddress = getAddress(data);
    setAddress(fullAddress);
  };
  const handerClick = (e) => {
    if (e.target.name === 'gender') setGender(e.target.value);
    else if (e.target.name === 'calender') setBirthday(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };
  return (
    <Container>
      <SignUpHead>
        <Title>회원가입</Title>
        <SubTitle>가지 마켓에 오신것을 환영합니다! </SubTitle>
      </SignUpHead>
      <Line />
      <Form onSubmit={(e) => submitHandler(e)}>
        <InputBox
          title={'아이디'}
          placeholder={'아이디를 입력하세요'}
          value={id}
          id={'id'}
          setVaule={setId}
          subTitle={'6글자 이상 이여야 합니다'}
          type={'text'}
        />
        <InputBox
          title={'비밀번호'}
          placeholder={'비밀번호를 입력하세요.'}
          value={password}
          id={'password'}
          setVaule={setPassword}
          subTitle={'8글자 이상 이고 영어와 숫자가 포함되어야 합니다'}
          type={'password'}
        />
        <InputBox
          title={'비밀번호 확인'}
          placeholder={'비밀번호를 입력하세요.'}
          value={confirmPassword}
          id={'confirmPassword'}
          setVaule={setConfirmPassword}
          subTitle={'비밀번호와 일치하여야 합니다'}
          type={'password'}
        />
        <InputBox
          title={'닉네임'}
          placeholder={'닉네임을 입력하세요.'}
          value={nickName}
          id={'nickName'}
          setVaule={setNickName}
          type={'text'}
        />
        <InputBox
          title={'주소'}
          placeholder={'주소를 입력하세요.'}
          value={address}
          id={'address'}
          setVaule={setAddress}
          clickHandler={() => open({ onComplete: handleComplete })}
        />
        <InputBox
          title={'상세주소'}
          placeholder={'상세주소를 입력하세요.'}
          value={addressDetail}
          id={'addressDetail'}
          setVaule={setAddressDetail}
          type={'text'}
        />
        <FlexBox onChange={(e) => handerClick(e)}>
          <FlexItem>
            <Title margin={'50px'}>생년월일</Title>
            <Date defaultValue={birthday} type='date' id='calender' name='calender'></Date>
          </FlexItem>

          <FlexItem margin={'50px'}>
            <Title margin={'10px'}>성별</Title>
            <Raido type='radio' name='gender' value={'남자'} />
            남자
            <Raido type='radio' name='gender' value={'여자'} />
            여자
          </FlexItem>
        </FlexBox>
        <ButtonBox>
          {isFormValid ? (
            <Button size='lg'>회원가입</Button>
          ) : (
            <Button size='lg' isDisabled={!isFormValid}>
              회원가입
            </Button>
          )}
        </ButtonBox>
      </Form>
    </Container>
  );
}
const Container = styled.div`
  width: 500px;
  height: calc(100vh - 102px);
  margin: 0 auto;
  box-shadow: 0px 0px 10px gray;
  padding: 50px 100px;
`;
const Title = styled.div`
  font-weight: 800;
  font-size: 16px;
  margin-right: 10px;
  margin-left: ${(props) => props.margin};
`;
const Date = styled.input`
  width: 100px;
  height: 20px;
`;
const SubTitle = styled.p`
  margin-left: 30px;
  padding-top: 7px;
  font-size: 10px;
  vertical-align: bottom;
  color: #9a9a9a;
`;
const SignUpHead = styled.div`
  display: flex;
`;
const Raido = styled.input``;
const Line = styled.div`
  border-bottom: 1px solid #eeeeee;
  margin-top: 15px;
  width: 500px;
`;
const Form = styled.form``;
const FlexBox = styled.div`
  display: flex;
  margin-top: 30px;
  justify-content: flex-start;
`;
const FlexItem = styled.div`
  display: flex;
  align-items: center;
  margin-left: ${(props) => props.margin};
`;
const ButtonBox = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: center;
`;
