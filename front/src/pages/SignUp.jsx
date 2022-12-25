import React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import getAddress from 'utils/getAddress';
import Button from 'components/common/Button';
import { isVaild } from 'utils/checkVaildForm';
import InputTextBox from 'components/common/InputTextBox';
import InputTitle from 'components/common/InputTitle';
import { PRIMARY_COLOR, GRAY_COLOR, WHITE_COLOR } from 'components/common/commonColor';
import logo200 from 'assets/BasicLogo.svg';
import man from 'assets/man.png';
import woman from 'assets/woman.png';
import { useNavigate } from 'react-router-dom';
import { usePostUserSignFormMutation, usePostUserCheckIdMutation } from 'services/signUpApi';
const DaumURL = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
const NICK_NAME_MIX_LENGTH = 4;
const INPUT_MIN_LENGTH = 1;

export default function SignUp() {
  const nav = useNavigate();

  const [createUser] = usePostUserSignFormMutation();
  const [checkUserId] = usePostUserCheckIdMutation();
  const [signUpForm, setSignUpForm] = useState({
    id: '',
    password: '',
    confirmPassword: '',
    name: '',
    nickName: '',
    address: '',
    addressDetail: '',
    birthday: '',
    gender: '',
  });

  const open = useDaumPostcodePopup(DaumURL);

  const isIdVaild = isVaild('ID', signUpForm.id);

  const isPasswordVaild = isVaild('PW', signUpForm.password);

  const isPasswordConfirmVaild =
    signUpForm.confirmPassword.length <= INPUT_MIN_LENGTH ||
    signUpForm.password === signUpForm.confirmPassword;

  const isNickNameVaild =
    signUpForm.nickName.length >= NICK_NAME_MIX_LENGTH ||
    signUpForm.nickName.length < INPUT_MIN_LENGTH;

  const isFormValid =
    isIdVaild &&
    signUpForm.id.length > INPUT_MIN_LENGTH &&
    isPasswordVaild &&
    signUpForm.password.length > INPUT_MIN_LENGTH &&
    isNickNameVaild &&
    isPasswordConfirmVaild &&
    isVaild('ETC', [
      signUpForm.address,
      signUpForm.addressDetail,
      signUpForm.birthday,
      signUpForm.gender,
      signUpForm.name,
    ]);

  useEffect(() => {
    const isToken = sessionStorage.getItem('userToken');
    if (isToken !== null) {
      alert('이미 로그인 하셨습니다. 홈페이지로 돌아갑니다.');
      nav('/');
    }
  }, []);
  const handleComplete = (data) => {
    const fullAddress = getAddress(data);
    setSignUpForm((prev) => ({ ...prev, address: fullAddress }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await createUser({
        userId: signUpForm.id,
        userPwd: signUpForm.password,
        userName: signUpForm.name,
        userNickName: signUpForm.nickName,
        userGender: signUpForm.gender,
        userBirth: '0823',
        userPhone: '',
        userAddress: signUpForm.address,
        socialKind: '0',
      }).unwrap();
      if (res.result === 'success') {
        alert('회원가입이 완료되었습니다.');
        nav('/');
      }
    } catch (e) {
      console.log(e);
    }
  };
  const changeHandler = (e) => {
    if (e.target.type === 'radio')
      setSignUpForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    else setSignUpForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  const checkId = async (e) => {
    e.preventDefault();

    try {
      const res = await checkUserId({ userId: signUpForm.id }).unwrap();
      if (res.result === 'used') alert('이미 사용중인 아이디 입니다. 다른 아이디를 입력하세요.');
      else alert('사용가능한 아이디 입니다.');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Container>
      <SignUpHead>
        <Title>회원가입</Title>
        <SubTitle>가지 마켓에 오신것을 환영합니다! </SubTitle>
      </SignUpHead>
      <Line />
      <Form onChange={(e) => changeHandler(e)}>
        <InputTitle
          title='아이디'
          signUpSubTitle={'6글자 이상이여야 합니다'}
          isVaild={isIdVaild}
          isRequired
        />
        {isIdVaild && signUpForm.id.length > 1 && (
          <>
            <CkeckIdButton onClick={(e) => checkId(e)}>아이디 중복 검사</CkeckIdButton>
          </>
        )}
        <InputTextBox
          id={'id'}
          value={signUpForm.id}
          containerBottom={'20px'}
          width={'500px'}
          placeholder={'아이디를 입력하세요'}
          type={'text'}
        />

        <InputTitle
          title={'비밀번호'}
          signUpSubTitle={'8글자 이상 이고 영어와 숫자가 포함되어야 합니다'}
          isVaild={isPasswordVaild}
          isRequired
        />
        <InputTextBox
          id={'password'}
          containerBottom={'15px'}
          value={signUpForm.password}
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
          containerBottom={'20px'}
          value={signUpForm.confirmPassword}
          width={'500px'}
          placeholder={'비밀번호를 입력하세요.'}
          type={'password'}
        />

        <InputTitle title={'이름'} isRequired />
        <InputTextBox
          id={'name'}
          value={signUpForm.name}
          containerBottom={'20px'}
          width={'500px'}
          placeholder={'이름을 입력하세요.'}
          type={'text'}
        />

        <InputTitle
          title={'닉네임'}
          signUpSubTitle={'4글자 이상이여야 합니다.'}
          isVaild={isNickNameVaild}
          isRequired
        />
        <InputTextBox
          id={'nickName'}
          value={signUpForm.nickName}
          containerBottom={'20px'}
          width={'500px'}
          placeholder={'닉네임을 입력하세요.'}
          type={'text'}
        />

        <InputTitle title={'주소'} isVaild={isNickNameVaild} isRequired />
        <InputTextBox
          id={'address'}
          value={signUpForm.address}
          width={'500px'}
          containerBottom={'20px'}
          padding={'10px'}
          placeholder={'주소를 입력하세요.'}
          type={'text'}
          isReadOnly={true}
          clickHandler={() => open({ onComplete: handleComplete })}
        />

        <InputTitle title={'상세주소'} isRequired />
        <InputTextBox
          id={'addressDetail'}
          value={signUpForm.addressDetail}
          padding={'10px'}
          containerBottom={'20px'}
          width={'500px'}
          placeholder={'상세주소를 입력하세요.'}
          type={'text'}
        />

        <FlexBox>
          <FlexItem>
            <Title margin={'50px'}>생년월일</Title>
            <Date
              defaultValue={signUpForm.birthday}
              data-placeholder='생년월일'
              type='date'
              id='birthday'
              name='calender'
              required
            ></Date>
          </FlexItem>

          <FlexItem margin={'50px'}>
            <Title margin={'10px'}>성별</Title>
            <HiddenRadioButton id='man' type='radio' name='gender' value={'0'} />
            <RadioButton htmlFor='man' type={'man'}></RadioButton>
            <HiddenRadioButton id='woman' type='radio' name='gender' value={'1'} />
            <RadioButton htmlFor='woman' type={'woman'}></RadioButton>
          </FlexItem>
        </FlexBox>
        <ButtonBox>
          {isFormValid ? (
            <Button size='lg' type='submit' onClick={(e) => submitHandler(e)}>
              회원가입
            </Button>
          ) : (
            <Button size='lg' type='submit' isDisabled={!isFormValid}>
              회원가입
            </Button>
          )}
        </ButtonBox>
      </Form>
      <CopyRight href='https://www.flaticon.com/kr/free-icons/' title='성별 아이콘'>
        성별 아이콘 제작자: Vitaly Gorbachev - Flaticon
      </CopyRight>
    </Container>
  );
}
const CkeckIdButton = styled.button`
  position: absolute;
  top: 95px;
  background: ${PRIMARY_COLOR};
  border: 3px solid ${PRIMARY_COLOR};
  color: ${WHITE_COLOR};
  cursor: pointer;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
  transition: all 0.2s;
  margin-left: 5px;
`;

const Container = styled.div`
  width: 700px;
  height: 800px;
  margin: 30px auto;
  border-radius: 35px;
  box-shadow: 0px 0px 30px 1px ${GRAY_COLOR};
  padding: 20px 100px;
`;

const Title = styled.div`
  font-weight: 800;
  font-size: 16px;
  margin-right: 10px;
  margin-left: ${(props) => props.margin};
`;
const Date = styled.input`
  & {
    padding-right: 15px;
    position: relative;
    background: url(${logo200}) no-repeat right center;
    border-radius: 5px;
  }
  &:hover,
  &:active {
    border: 2px solid ${PRIMARY_COLOR};
    border-radius: 5px;
  }

  &::-webkit-clean-button,
  &::-webkit-inner-spin-button {
    display: none;
  }
  &::-webkit-calendar-picker-indicator {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    color: transparent;
    cursor: pointer;
  }
  &::before {
    content: attr(data-placeholder);
    width: 100%;
  }
  &:valid::before {
    display: none;
  }
  width: 125px;
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
const RadioButton = styled.label`
  display: inline-block;
  width: 40px;
  height: 70px;
  border-radius: 20px;

  background: ${(props) =>
    props.type === 'man' ? `url(${man}) no-repeat` : `url(${woman}) no-repeat center`};
  cursor: pointer;
`;
const HiddenRadioButton = styled.input`
  display: none;
  &:checked + ${RadioButton} {
    transition: 0.7s;
    transform: scale(1.3);
  }
`;
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
  margin-top: 20px;
  display: flex;
  justify-content: center;
`;
const CopyRight = styled.a`
  position: fixed;
  bottom: 0px;
  right: 0px;
  text-decoration: none;
  color: #cccccc;
`;
