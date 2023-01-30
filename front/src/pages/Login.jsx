import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';

import styled from 'styled-components';

import { usePostUserLoginMutation } from 'services/signUpApi';
import { startSession } from 'store/sessionSlice';

import InputTextBox from 'components/common/InputTextBox';
import InputTitle from 'components/common/InputTitle';
import Button from 'components/common/Button';
import DecoFooter from 'components/common/DecoFooter';

import useToast from 'hooks/toast';

import {
  GRAY_COLOR,
  PRIMARY_COLOR,
  WHITE_COLOR,
} from 'components/common/commonColor';

import KakaoImg from 'assets/KakaoImg.png';
import NaverImg from 'assets/NaverImg.png';

export default function Login() {
  const inputRef = useRef();

  const [login] = usePostUserLoginMutation();

  const nav = useNavigate();

  const { addToast } = useToast();

  const dispatch = useDispatch();

  const [signUpForm, setSignUpForm] = useState({
    id: '',
    password: '',
  });

  const submitHandler = async (e) => {
    e.preventDefault();

    if (signUpForm.id !== '' && signUpForm.password !== '') {
      try {
        const res = await login({
          userId: signUpForm.id,
          userPwd: signUpForm.password,
        }).unwrap();
        if (res.result === 'fail') {
          addToast({
            isToastSuccess: false,
            isMainTheme: true,
            toastTitle: '로그인 실패!',
            toastMessage: '아이디 및 비밀번호를 확인해주세요.',
          });
        } else if (res.result === 'success') {
          addToast({
            isToastSuccess: true,
            isMainTheme: true,
            toastTitle: '로그인 성공!',
            toastMessage: '가지마켓에 오신 것을 환영합니다.',
          });
          dispatch(startSession(res.token));
          setTimeout(() => nav('/'), 500);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      addToast({
        isToastSuccess: false,
        isMainTheme: true,
        toastTitle: '로그인 실패!',
        toastMessage: '아이디 및 비밀번호를 입력해주세요.',
      });
    }
  };

  const changeHandler = (e) => {
    setSignUpForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Container>
      <SignUpHead>
        <Title>로그인</Title>
        <SubTitle>가지마켓에 오신 것을 환영합니다! </SubTitle>
      </SignUpHead>
      <Line width={'420px'} marginBottom={'45px'} />
      <Form onChange={(e) => changeHandler(e)}>
        <InputBox>
          <InputTitle title={'아이디'} />
          <InputTextBox
            inputRef={inputRef}
            id={'id'}
            value={signUpForm.id}
            containerBottom={'25px'}
            width={'400px'}
            placeholder={'아이디를 입력하세요'}
            type={'text'}
          />

          <InputTitle title={'비밀번호'} />
          <InputTextBox
            id={'password'}
            value={signUpForm.password}
            containerBottom={'20px'}
            width={'400px'}
            placeholder={'비밀번호를 입력하세요.'}
            type={'password'}
          />
        </InputBox>
        <ButtonBox>
          <Button
            type='submit'
            customSize='400px'
            onClick={(e) => submitHandler(e)}
          >
            로그인
          </Button>
        </ButtonBox>
        <SubBox>
          <FindIdPw>아이디/비밀번호 찾기</FindIdPw>
          <NavLink to='/signup' style={{ textDecoration: 'none' }}>
            <ToSignUp>회원가입</ToSignUp>
          </NavLink>
        </SubBox>
        {/* <LineBox>
          <Line width={'200px'} marginBottom={'20px'} />
          <LineOR>OR</LineOR>
          <Line width={'200px'} marginBottom={'20px'} />
        </LineBox>
        <SocialLogin onClick={(e) => e.preventDefault()}>
          <Img src={KakaoImg}></Img>
        </SocialLogin>
        <SocialLogin onClick={(e) => e.preventDefault()}>
          <Img src={NaverImg}></Img>
        </SocialLogin> */}
      </Form>
      <DecoFooter />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;
  height: 500px;
  background: ${WHITE_COLOR};
  padding: 40px 50px 0 50px;
  margin: 180px auto;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  border: 2px solid #6c17dc50;
`;

const InputBox = styled.div``;

const Img = styled.img`
  cursor: pointer;
`;

const ToSignUp = styled.div`
  color: ${GRAY_COLOR};
  font-size: 13px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const FindIdPw = styled.div`
  color: ${GRAY_COLOR};
  font-size: 13px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const SubBox = styled.div`
  width: 350px;
  margin-top: 38px;
  display: flex;
  justify-content: space-evenly;
`;

const LineBox = styled.div`
  display: flex;
  padding: 40px 50px;
  padding-top: 30px;
  color: ${GRAY_COLOR};
`;

const LineOR = styled.span`
  margin: 0px 10px;
`;

const Line = styled.hr`
  margin-top: 15px;
  border: 1px solid #eee;
  width: ${(props) => props.width};
  margin-bottom: ${(props) => props.marginBottom};
`;

const Title = styled.div`
  font-weight: 800;
  font-size: 18px;
  color: ${PRIMARY_COLOR};
  margin-right: 10px;
  margin-left: ${(props) => props.margin};
`;

const SubTitle = styled.p`
  font-size: 14px;
  margin-left: 10px;
  padding-bottom: 2px;
  color: #9a9a9a;
`;

const SignUpHead = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 5;
`;

const ButtonBox = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: center;
`;

const SocialLogin = styled.button`
  width: 400px;
  height: 60px;
  display: block;
  background-color: white;
  margin: auto;
  border: none;
  margin-bottom: 20px;
`;
