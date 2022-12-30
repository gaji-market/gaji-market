import InputTextBox from 'components/common/InputTextBox';
import InputTitle from 'components/common/InputTitle';
import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import Button from 'components/common/Button';
import { NavLink, useNavigate } from 'react-router-dom';
import { GRAY_COLOR } from 'components/common/commonColor';
import KakaoImg from 'assets/KakaoImg.png';
import NaverImg from 'assets/NaverImg.png';
import { usePostUserLoginMutation } from 'services/signUpApi';
import { useEffect } from 'react';
import Toast from 'components/common/Toast';

export default function Login() {
  const [login] = usePostUserLoginMutation();
  const nav = useNavigate();

  const [toast, setToast] = useState({
    toastTitle: '',
    toastMessage: '',
    isToastAppear: false,
    isToastSuccess: false,
    isMainThema: true,
    poistion: 'top',
  });
  const [signUpForm, setSignUpForm] = useState({
    id: '',
    password: '',
  });
  const toastHandler = (message, isSuccess, isMainThema = true, position = 'top') => {
    setToast((prev) => ({
      ...prev,
      toastMessage: message,
      isToastAppear: true,
      isToastSuccess: isSuccess,
      isMainThema: isMainThema,
      position: position,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (signUpForm.id !== '' && signUpForm.password !== '') {
      try {
        const res = await login({ userId: signUpForm.id, userPwd: signUpForm.password }).unwrap();
        if (res.result === 'fail') {
          toastHandler('아이디 및 비밀번호를 확인해주세요.', false, true, 'center');
        } else if (res.result === 'success') {
          toastHandler('로그인 되었습니다.', true);
          //setTimeout(() => nav('/'), 2000);
          //sessionStorage.setItem('userToken', res.token);
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      toastHandler('아이디 및 비밀번호를 입력해주세요.', false);
    }
  };

  const changeHandler = (e) => {
    setSignUpForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  useEffect(() => {
    const isToken = sessionStorage.getItem('userToken');
    if (isToken !== null) {
      alert('이미 로그인 하셨습니다. 홈페이지로 돌아갑니다.');
      nav('/');
    }
  }, []);
  return (
    <Container>
      {toast.isToastAppear && <Toast toast={toast} setToast={setToast} />}

      <SignUpHead>
        <Title>로그인</Title>
        <SubTitle>가지 마켓에 오신것을 환영합니다! </SubTitle>
      </SignUpHead>
      <Line width={'500px'} marginBottom={'55px'} />
      <Form onChange={(e) => changeHandler(e)}>
        <InputBox>
          <InputTitle title={'아이디'} />
          <InputTextBox
            id={'id'}
            value={signUpForm.id}
            containerBottom={'20px'}
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
          <Button customSize='400px' onClick={(e) => submitHandler(e)}>
            로그인
          </Button>
        </ButtonBox>
        <SubBox>
          <FindIdPw>아이디/비밀번호 찾기</FindIdPw>

          <NavLink to='/signup' style={{ textDecoration: 'none' }}>
            <ToSignUp>회원가입</ToSignUp>
          </NavLink>
        </SubBox>
        <LineBox>
          <Line width={'200px'} marginBottom={'20px'} />
          <LineOR>OR</LineOR>
          <Line width={'200px'} marginBottom={'20px'} />
        </LineBox>
        <SocialLogin>
          <Img src={KakaoImg}></Img>
        </SocialLogin>
        <SocialLogin>
          <Img src={NaverImg}></Img>
        </SocialLogin>
      </Form>
    </Container>
  );
}
const Container = styled.div`
  width: 700px;
  height: 800px;
  margin: 60px auto;
  border-radius: 35px;
  box-shadow: 0px 0px 30px 1px ${GRAY_COLOR};
  padding: 50px 100px;
`;
const InputBox = styled.div`
  margin-left: 45px;
`;
const Img = styled.img`
  width: 100%;
`;
const ToSignUp = styled.div`
  color: #cccccc;
  text-decoration: none;
  font-size: 13px;
`;
const FindIdPw = styled.div`
  color: #cccccc;
  font-size: 13px;
`;
const SubBox = styled.div`
  width: 300px;
  margin: 20px auto;
  display: flex;
  justify-content: space-evenly;
`;
const LineBox = styled.div`
  display: flex;
  padding: 40px 50px;
  padding-top: 30px;
  color: #cccccc;
`;
const LineOR = styled.span`
  margin: 0px 10px;
`;
const Line = styled.hr`
  border: 1px solid #cccccc;
  width: ${(props) => props.width};
  margin-bottom: ${(props) => props.marginBottom};
`;

const Title = styled.div`
  font-weight: 800;
  font-size: 16px;
  margin-right: 10px;
  margin-left: ${(props) => props.margin};
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
  margin-bottom: 15px;
`;

const Form = styled.form``;

const ButtonBox = styled.div`
  margin-top: 30px;
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
