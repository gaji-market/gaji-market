import InputTextBox from 'components/common/InputTextBox';
import InputTitle from 'components/common/InputTitle';
import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import Button from '../components/common/Button';
import { isVaild } from 'utils/checkVaildForm';
import { NavLink } from 'react-router-dom';
import { GRAY_COLOR } from 'components/common/commonColor';
import KakaoImg from '../assets/KakaoImg.png';
import NaverImg from '../assets/NaverImg.png';
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
        <InputTitle
          title={'아이디'}
          signUpSubTitle={'6글자 이상 이여야 합니다'}
          isVaild={isIdVaild}
          isRequired
        />
        <InputTextBox
          id={'id'}
          setVaule={setId}
          value={id}
          containerBottom={'20px'}
          width={'350px'}
          placeholder={'아이디를 입력하세요'}
          type={'text'}
        />

        <InputTitle
          title={'비밀번호'}
          signUpSubTitle={'6글자 이상 이여야 합니다'}
          isVaild={isPasswordVaild}
          isRequired
        />
        <InputTextBox
          id={'password'}
          setVaule={setPassword}
          value={password}
          containerBottom={'20px'}
          width={'350px'}
          placeholder={'비밀번호를 입력하세요.'}
          type={'password'}
        />
        <ButtonBox>
          {isFormValid ? (
            <Button customSize='350px'>로그인</Button>
          ) : (
            <Button customSize='350px' isDisabled={!isFormValid}>
              로그인
            </Button>
          )}
        </ButtonBox>
        <SubBox>
          <FindIdPw>아이디/비밀번호 찾기</FindIdPw>
          <NavLink to='/signup' style={{ textDecoration: 'none' }}>
            <ToSignUp>회원가입</ToSignUp>
          </NavLink>
        </SubBox>
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
  margin: 15px 0px 0px 100px;
  display: flex;
  justify-content: space-evenly;
`;

const Container = styled.div`
  width: 700px;
  height: 800px;
  margin: 60px auto;
  border-radius: 35px;
  box-shadow: 0px 0px 30px 1px ${GRAY_COLOR};
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
  margin-bottom: 30px;
  width: 500px;
`;

const Form = styled.form``;

const ButtonBox = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: center;
`;
const SocialLogin = styled.button`
  width: 350px;
  height: 40px;
  display: block;
  background-color: white;
  margin: 20px auto;
  border: none;
`;
