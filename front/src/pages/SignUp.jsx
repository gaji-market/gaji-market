import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { BiMaleSign, BiFemaleSign } from 'react-icons/bi';

import getAddress from 'utils/getAddress';
import { isVaild } from 'utils/checkVaildForm';
import makeToday from 'utils/makeToday';

import {
  PRIMARY_COLOR,
  GRAY_COLOR,
  WHITE_COLOR,
} from 'components/common/commonColor';
import Button from 'components/common/Button';
import InputTextBox from 'components/common/InputTextBox';
import InputTitle from 'components/common/InputTitle';
import DecoFooter from 'components/common/DecoFooter';

import logo200 from 'assets/BasicLogo.svg';

import useToast from 'hooks/toast';

import {
  usePostUserSignFormMutation,
  usePostUserCheckIdMutation,
} from 'services/signUpApi';

const DaumURL =
  'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
const NICK_NAME_MIX_LENGTH = 4;
const INPUT_MIN_LENGTH = 1;

export default function SignUp() {
  const inputRef = useRef();
  const today = makeToday();
  const nav = useNavigate();
  const { addToast } = useToast();
  const [createUser] = usePostUserSignFormMutation();
  const [checkUserId] = usePostUserCheckIdMutation();
  const [isPossibleId, setIsPossibleId] = useState(false);
  const [isTextAppear, setIsTextAppear] = useState(false);
  const [signUpForm, setSignUpForm] = useState({
    id: '',
    password: '',
    confirmPassword: '',
    name: '',
    nickName: '',
    address: '',
    birthday: '',
    gender: '',
  });

  const open = useDaumPostcodePopup(DaumURL);

  const isIdVaild = isVaild('ID', signUpForm.id);

  const isPasswordVaild = isVaild('PW', signUpForm.password);

  const isPasswordConfirmVaild =
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
    isPossibleId &&
    isVaild('ETC', [
      signUpForm.address,
      signUpForm.birthday,
      signUpForm.gender,
      signUpForm.name,
    ]);

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
        addToast({
          isToastSuccess: true,
          isMainTheme: false,
          toastTitle: '회원가입 완료',
          toastMessage: '가지마켓의 회원이 되신 것을 환영해요!',
        });
        nav('/login');
      }
    } catch (error) {
      console.log(error);
    }
  };
  const changeHandler = (e) => {
    if (e.target.id === 'id' && signUpForm.id.length <= 5) {
      setIsPossibleId(false);
      setIsTextAppear(false);
    }
    if (e.target.type === 'radio')
      setSignUpForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    else setSignUpForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  const checkId = async (e) => {
    e.preventDefault();

    try {
      const res = await checkUserId({ userId: signUpForm.id }).unwrap();
      if (res.result === 'used') {
        addToast({
          isToastSuccess: false,
          isMainTheme: true,
          toastTitle: '이미 사용중인 아이디입니다.',
          toastMessage: '다른 아이디를 입력해주세요.',
        });
        setIsPossibleId(false);
      } else if (res.result === 'success') {
        addToast({
          isToastSuccess: true,
          isMainTheme: false,
          toastTitle: '아이디 중복 체크!',
          toastMessage: '사용 가능한 아이디입니다.',
        });
        setIsPossibleId(true);
      } else {
        addToast({
          isToastSuccess: false,
          isMainTheme: true,
          toastTitle: '예기치 못한 에러가 발생했어요.',
          toastMessage: '잠시 후 다시 시도해주세요.',
        });
        setIsPossibleId(false);
      }
      setIsTextAppear(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Container>
      <SignUpHead>
        <Title>회원가입</Title>
        <SubTitle>가지마켓에 오신 것을 환영합니다! </SubTitle>
      </SignUpHead>
      <Line />
      <Form onChange={(e) => changeHandler(e)}>
        <InputTitle
          title='아이디'
          signUpSubTitle={'(한글제외) 6글자 이상 12글자 이하 이여야 합니다'}
          isVaild={isIdVaild}
          isRequired
        />
        {isIdVaild && signUpForm.id.length > 1 && (
          <>
            <CkeckIdButton onClick={(e) => checkId(e)}>
              아이디 중복 검사
            </CkeckIdButton>
            {isTextAppear &&
              (isPossibleId ? (
                <IdTextMessage color={PRIMARY_COLOR}>
                  등록 가능한 아이디 입니다.
                </IdTextMessage>
              ) : (
                <IdTextMessage color={'#E8828D'}>
                  이미 등록된 아이디 입니다.
                </IdTextMessage>
              ))}
          </>
        )}
        <InputTextBox
          inputRef={inputRef}
          id={'id'}
          value={signUpForm.id}
          width={'400px'}
          containerBottom={'20px'}
          placeholder={'아이디를 입력하세요'}
          type={'text'}
        />

        <InputTitle
          title={'비밀번호'}
          signUpSubTitle={
            '(특수문자 제외) 8글자 이상 이고 영어와 숫자가 포함되어야 합니다'
          }
          isVaild={isPasswordVaild}
          isRequired
        />
        <InputTextBox
          id={'password'}
          containerBottom={'20px'}
          value={signUpForm.password}
          width={'400px'}
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
          width={'400px'}
          placeholder={'비밀번호를 입력하세요.'}
          type={'password'}
        />

        <InputTitle title={'이름'} isRequired />
        <InputTextBox
          id={'name'}
          value={signUpForm.name}
          containerBottom={'20px'}
          width={'400px'}
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
          width={'400px'}
          placeholder={'닉네임을 입력하세요.'}
          type={'text'}
        />

        <InputTitle title={'주소'} isVaild={isNickNameVaild} isRequired />
        <InputTextBox
          id={'address'}
          value={signUpForm.address}
          width={'400px'}
          containerBottom={'20px'}
          padding={'10px'}
          placeholder={'주소를 입력하세요.'}
          type={'text'}
          isReadOnly={true}
          clickHandler={() => open({ onComplete: handleComplete })}
        />

        <FlexBox>
          <FlexItem>
            <Asterisk>*</Asterisk>
            <Text margin={'50px'}>생년월일</Text>
            <Date
              defaultValue={signUpForm.birthday}
              data-placeholder='생년월일 선택'
              type='date'
              id='birthday'
              name='calender'
              max={today}
              required
            ></Date>
          </FlexItem>

          <FlexItem className='gender-checker' margin={'50px'}>
            <Asterisk>*</Asterisk>
            <Text margin={'10px'}>성별</Text>
            <HiddenRadioButton
              id='man'
              type='radio'
              name='gender'
              value={'0'}
            />
            <RadioButton htmlFor='man' type={'man'}>
              <MaleIcon />
            </RadioButton>

            <HiddenRadioButton
              id='woman'
              type='radio'
              name='gender'
              value={'1'}
            />
            <RadioButton htmlFor='woman' type={'woman'}>
              <FemaleIcon />
            </RadioButton>
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
      <DecoFooter />
    </Container>
  );
}

const CkeckIdButton = styled.button`
  top: -2px;
  position: absolute;
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
const IdTextMessage = styled.span`
  position: absolute;
  left: 160px;
  top: 3px;
  font-size: 13px;
  color: ${(props) => props.color};
`;
const Container = styled.div`
  width: 500px;
  margin: 100px auto;
  padding: 50px 50px 80px 50px;
  border-radius: 20px;
  border: 2px solid #6c17dc50;
  background: ${WHITE_COLOR};
  position: relative;
  overflow: hidden;

  .bottom-deco {
    position: absolute;
    left: -250px;
    bottom: -20px;
    opacity: 0.5;
  }
`;

const Title = styled.div`
  font-weight: 900;
  font-size: 18px;
  color: ${PRIMARY_COLOR};
  margin-right: 10px;
  margin-left: ${(props) => props.margin};
`;

const Asterisk = styled.span`
  font-weight: 900;
  margin-right: 10px;
  color: ${PRIMARY_COLOR};
`;

const Date = styled.input`
  width: 150px;
  height: 20px;
  padding: 15px 0;
  padding-left: 8px;
  border: 2px solid ${GRAY_COLOR};
  position: relative;
  background: url(${logo200}) no-repeat right center;
  border-radius: 8px;
  transition: all 0.1s;
  font-weight: 700;

  &:focus {
    outline: none;
  }

  &:hover,
  &:focus,
  &:active {
    border: 2px solid ${PRIMARY_COLOR};
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
    color: ${GRAY_COLOR};
    width: 100%;
  }

  &:valid::before {
    display: none;
  }
`;

const SubTitle = styled.p`
  font-size: 14px;
  margin-left: 10px;
  padding-bottom: 2px;
  color: #9a9a9a;
`;

const SignUpHead = styled.div`
  display: flex;
`;

const RadioButton = styled.label`
  display: inline-block;
  font-size: 25px;
  transition: all 0.7s;
  cursor: pointer;
`;

const MaleIcon = styled(BiMaleSign)`
  color: #3750e3;
  transform: rotate(-45deg);
`;

const FemaleIcon = styled(BiFemaleSign)`
  color: #fd7676;
`;

const HiddenRadioButton = styled.input`
  display: none;
  &:checked + ${RadioButton} {
    transform: scale(1.6);
  }
`;

const Line = styled.div`
  border-bottom: 1px solid #eeeeee;
  margin-top: 15px;
  margin-bottom: 15px;
  width: 400px;
`;

const Form = styled.form`
  margin-top: 40px;
  position: relative;
  z-index: 5;
`;

const FlexBox = styled.div`
  display: flex;

  .gender-checker {
    margin-left: 40px;
  }
`;

const FlexItem = styled.div`
  display: flex;
  align-items: center;
`;

const Text = styled.p`
  font-weight: 700;
  margin-right: 10px;
`;

const ButtonBox = styled.div`
  margin-top: 32px;
`;
