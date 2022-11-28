import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import getAddress from 'utils/getAddress';
import Button from '../components/common/Button';
import { isVaild } from 'utils/checkVaildForm';
import InputTextBox from 'components/common/InputTextBox';
import InputTitle from 'components/common/InputTitle';
import { PRIMARY_COLOR } from 'components/common/commonColor';
export default function SignUp() {
  const DaumURL = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickName, setNickName] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');

  const open = useDaumPostcodePopup(DaumURL);
  const isIdVaild = isVaild('ID', id);
  const isPasswordVaild = isVaild('PW', password);
  const isPasswordConfirmVaild = confirmPassword.length <= 1 || password === confirmPassword;
  const isNickNameVaild = nickName.length >= 4 || nickName.length < 1;
  const isFormValid =
    isIdVaild &&
    id.length > 1 &&
    isPasswordVaild &&
    password.length > 1 &&
    isNickNameVaild &&
    isPasswordConfirmVaild &&
    isVaild('ETC', [address, addressDetail, birthday, gender]);

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
        <InputTitle
          title='아이디'
          signUpSubTitle={'6글자 이상 이여야 합니다'}
          isVaild={isIdVaild}
          margin={'10px'}
          isRequired
        />
        <InputTextBox
          id={'id'}
          setVaule={setId}
          value={id}
          containerBottom={'20px'}
          width={'500px'}
          placeholder={'아이디를 입력하세요'}
          type={'text'}
        />

        <InputTitle
          title={'비밀번호'}
          signUpSubTitle={'8글자 이상 이고 영어와 숫자가 포함되어야 합니다'}
          isVaild={isPasswordVaild}
          margin={'10px'}
          isRequired
        />
        <InputTextBox
          id={'password'}
          setVaule={setPassword}
          containerBottom={'20px'}
          value={password}
          width={'500px'}
          placeholder={'비밀번호를 입력하세요.'}
          type={'password'}
        />

        <InputTitle
          title={'비밀번호 확인'}
          signUpSubTitle={'비밀번호와 일치하여야 합니다'}
          isVaild={isPasswordConfirmVaild}
          isRequired
        />
        <InputTextBox
          id={'confirmPassword'}
          setVaule={setConfirmPassword}
          containerBottom={'20px'}
          value={confirmPassword}
          width={'500px'}
          placeholder={'비밀번호를 입력하세요.'}
          type={'password'}
        />

        <InputTitle
          title={'닉네임'}
          signUpSubTitle={'4글자 이상이여야 합니다.'}
          isVaild={isNickNameVaild}
          isRequired
        />
        <InputTextBox
          id={'nickName'}
          setVaule={setNickName}
          value={nickName}
          containerBottom={'20px'}
          width={'500px'}
          placeholder={'닉네임을 입력하세요.'}
          type={'text'}
        />

        <InputTitle title={'주소'} isVaild={isNickNameVaild} isRequired />
        <InputTextBox
          id={'address'}
          setVaule={setAddress}
          value={address}
          width={'500px'}
          containerBottom={'20px'}
          padding={'10px'}
          placeholder={'주소를 입력하세요.'}
          type={'text'}
          clickHandler={() => open({ onComplete: handleComplete })}
        />

        <InputTitle title={'상세주소'} isRequired />
        <InputTextBox
          id={'addressDetail'}
          setVaule={setAddressDetail}
          value={addressDetail}
          padding={'10px'}
          containerBottom={'20px'}
          width={'500px'}
          placeholder={'상세주소를 입력하세요.'}
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
  width: 700px;
  height: 800px;
  margin: 50px auto;
  box-shadow: 0px 0px 13px 1px ${PRIMARY_COLOR};
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
  margin-left: 15px;
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
  margin-bottom: 15px;
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
