import InputTextBox from 'components/common/InputTextBox';
import InputTitle from 'components/common/InputTitle';
import React from 'react';
import { useState, useRef } from 'react';
import styled from 'styled-components';
import Button from 'components/common/Button';
import { useLocation } from 'react-router-dom';
import { GRAY_COLOR } from 'components/common/commonColor';

import { usePostUserEditMutation } from 'services/signUpApi';

export default function MyEditPage() {
  const inputRef = useRef(null);
  const [edit, data] = usePostUserEditMutation();
  const { state } = useLocation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [signUpForm, setSignUpForm] = useState({
    password: '',
    nickname: '',
    address: '',
  });
  const [isCorrectPW, setIsCorrectPW] = useState(false);
  const submitHandler = async (e) => {
    e.preventDefault();
    const res = await edit({
      userPwd: signUpForm.password,
      userNickName: signUpForm.nickname,
      userAddress: signUpForm.address,
    }).unwrap();
    console.log(res);
    // if (res.result === 'fail') {
    //   alert('회원정보 수정에 실패하였습니다. 다시 입력해주세요');
    // } else {
    //   alert('회원정보가 변경되었습니다.');
    //   nav('/mypage');
    // }
  };
  const changeHandler = (e) => {
    if (e.target.id === 'currentpassword') setCurrentPassword(e.target.value);
    else setSignUpForm({ ...signUpForm, [e.target.id]: e.target.value });
  };
  const passwordHandler = (e) => {
    e.preventDefault();
    if (currentPassword === state) {
      alert('정보수정페이지로 이동합니다.');
      setIsCorrectPW(true);
    } else {
      alert('현재 비밀번호와 다릅니다. 다시 입력해주시기 바랍니다.');
      setCurrentPassword('');
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  };
  return (
    <Container>
      {isCorrectPW ? (
        <>
          <SignUpHead>
            <Title>회원정보 변경</Title>
            <SubTitle>가지 마켓에 오신것을 환영합니다! </SubTitle>
          </SignUpHead>
          <Line width={'500px'} marginBottom={'50px'} />
          <Head>
            <div>아이디:vjvl95</div>
            <div>이름:홍짱</div>
            <div>생년월일:1995-08-23</div>
          </Head>
          <Form onChange={(e) => changeHandler(e)}>
            <InputBox>
              <InputTitle title={'새 비밀번호'} isRequired />
              <InputTextBox
                id={'password'}
                value={signUpForm.password}
                containerBottom={'20px'}
                width={'400px'}
                placeholder={'새 비밀번호를 입력하세요'}
                type={'password'}
              />

              <InputTitle title={'닉네임'} isRequired />
              <InputTextBox
                id={'nickname'}
                value={signUpForm.nickname}
                containerBottom={'20px'}
                width={'400px'}
                placeholder={'닉네임를 입력하세요.'}
                type={'text'}
              />
              <InputTitle title={'주소'} isRequired />
              <InputTextBox
                id={'address'}
                value={signUpForm.address}
                containerBottom={'20px'}
                width={'400px'}
                placeholder={'주소를 입력하세요.'}
                type={'text'}
              />
            </InputBox>
            <ButtonBox>
              <Button customSize='400px' onClick={(e) => submitHandler(e)}>
                정보 수정
              </Button>
            </ButtonBox>
          </Form>
        </>
      ) : (
        <>
          <SignUpHead>
            <Title>비밀번호 확인</Title>
          </SignUpHead>
          <Line width={'500px'} marginBottom={'50px'} />
          <Form onChange={(e) => changeHandler(e)}>
            <InputBox>
              <InputTitle title={'비밀번호'} />
              <InputTextBox
                inputRef={inputRef}
                id={'currentpassword'}
                value={currentPassword}
                containerBottom={'20px'}
                width={'400px'}
                placeholder={'비밀번호를 입력하세요'}
                type={'password'}
              />
            </InputBox>
            <ButtonBox>
              <Button customSize='400px' onClick={(e) => passwordHandler(e)}>
                제출
              </Button>
            </ButtonBox>
          </Form>
        </>
      )}
    </Container>
  );
}
const Head = styled.div`
  font-weight: 800;
  display: flex;
  justify-content: space-between;
  padding: 30px;
`;
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
