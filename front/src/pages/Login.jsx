import InputBox from 'components/common/InputBox';
import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import Button from '../components/common/Button';
import { isVaild } from 'utils/checkVaildForm';
import { NavLink } from 'react-router-dom';
import KakaoImg from '../assets/kakao_login_large_wide.png';
import NaverImg from '../assets/buttonNaver.png';
export default function Login() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const isIdVaild = isVaild('ID', id, true);
  const isPasswordVaild = isVaild('PW', password, true);
  const isFormValid = isIdVaild && isPasswordVaild;

  const submitHandler = (e) => {
    e.preventDefault();
  };
  return (
    <Container>
      <SignUpHead>
        <Title>로그인</Title>
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
          type={'text'}
          isVaild={isIdVaild}
        />
        <InputBox
          title={'비밀번호'}
          placeholder={'비밀번호를 입력하세요.'}
          value={password}
          id={'password'}
          setVaule={setPassword}
          type={'password'}
          isVaild={isPasswordVaild}
        />
        <ButtonBox>
          {isFormValid ? (
            <Button customSize='250px'>로그인</Button>
          ) : (
            <Button customSize='250px' isDisabled={!isFormValid}>
              로그인
            </Button>
          )}
        </ButtonBox>
        <DD>
          <FindIdPw>아이디/비밀번호 찾기</FindIdPw>
          <NavLink to='/signup' style={{ textDecoration: 'none' }}>
            <ToSignUp>회원가입</ToSignUp>
          </NavLink>
        </DD>
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
const SocialLogin = styled.div`
  width: 250px;
  height: 40px;
  margin: 30px auto;
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

const DD = styled.div`
  width: 300px;
  margin: 15px 0px 0px 100px;
  display: flex;
  justify-content: space-evenly;
`;
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
const Line = styled.div`
  border-bottom: 1px solid #eeeeee;
  margin-top: 15px;
  width: 500px;
`;
const Form = styled.form``;

const ButtonBox = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: center;
`;
