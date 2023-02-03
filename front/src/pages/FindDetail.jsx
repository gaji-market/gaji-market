import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import logo200 from 'assets/BasicLogo.svg';

import styled from 'styled-components';

import Button from 'components/common/Button';
import DecoFooter from 'components/common/DecoFooter';
import makeToday from 'utils/makeToday';

import { FIND_TYPE } from '../constants/finduser';
import {
  PRIMARY_COLOR,
  WHITE_COLOR,
  GRAY_COLOR,
} from 'components/common/commonColor';
import PrevButton from 'components/common/PrevButton';

import InputTextBox from 'components/common/InputTextBox';
import {
  usePostSearchIdPwMutation,
  usePostUpdatePasswordMutation,
} from 'services/signUpApi';

import useToast from 'hooks/toast';

export default function FindDetail() {
  const inputRef = useRef();
  const today = makeToday();
  const nav = useNavigate();
  const [searchIdPw] = usePostSearchIdPwMutation();
  const [updatePw] = usePostUpdatePasswordMutation();
  const { type } = useParams();
  const [responseId, setResponseId] = useState('');
  const [isFindId, setIsFindId] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    userBirth: '',
    userName: '',
    userPwd: '',
  });
  const [isCorrectUser, setIsCorrentUser] = useState(false);
  const { addToast } = useToast();

  const changeHandler = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const clickHandler = async () => {
    try {
      if (isCorrectUser) {
        const res = await updatePw(formData).unwrap();

        if (res.msg === 'Success') {
          addToast({
            isToastSuccess: true,
            isMainTheme: false,
            toastTitle: '비밀번호 변경 성공',
            toastMessage: '로그인 페이지로 이동합니다.',
          });
          nav('/login');
        } else {
          addToast({
            isToastSuccess: false,
            isMainTheme: false,
            toastTitle: '비밀번호 변경 실패',
            toastMessage: '잠시 후 다시 시도해주세요',
          });
        }
      } else {
        const res = await searchIdPw(formData).unwrap();
        if (type === 'id') {
          if (res.msg === 'Success') {
            setResponseId(res.resultId);
            setIsFindId(true);
          } else {
            setResponseId('fail');
          }
        } else {
          if (res.msg === 'Success') {
            addToast({
              isToastSuccess: true,
              isMainTheme: false,
              toastTitle: '사용자 정보 찾기 성공',
              toastMessage: '새 비밀번호 설정 페이지로 이동합니다.',
            });
            setIsCorrentUser(true);
          } else {
            addToast({
              isToastSuccess: false,
              isMainTheme: false,
              toastTitle: '사용자 정보 찾기 실패!',
              toastMessage: '입력하신 정보의 유저가 존재하지 않습니다.',
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <>
      <PrevButton />
      <Container>
        <SignUpHead>
          <Title>{FIND_TYPE[type]} 찾기</Title>
        </SignUpHead>
        <Line width={'420px'} marginBottom={'30px'} />
        <InputContainer onChange={changeHandler}>
          <FlexBox type={type}>
            {type === 'id' ? (
              <>
                <div>
                  <TextBox>
                    <Asterisk>*</Asterisk>
                    <Text margin={'50px'}>이름</Text>
                  </TextBox>

                  <InputTextBox
                    inputRef={inputRef}
                    id={'userName'}
                    value={formData.userName}
                    containerBottom={'25px'}
                    width={'180px'}
                    placeholder={'이름를 입력하세요'}
                    type={'text'}
                  />
                </div>
                <div>
                  <TextBox>
                    <Asterisk>*</Asterisk>
                    <Text margin={'50px'}>생년월일</Text>
                  </TextBox>
                  <Date
                    defaultValue={formData.userBirth}
                    data-placeholder='생년월일 선택'
                    type='date'
                    id='userBirth'
                    width='180px'
                    name='calender'
                    max={today}
                    required
                  ></Date>
                </div>
              </>
            ) : isCorrectUser ? (
              <>
                <TextBox>
                  <Asterisk>*</Asterisk>
                  <Text margin={'50px'}>새 비밀번호</Text>
                </TextBox>
                <InputTextBox
                  inputRef={inputRef}
                  id={'userPwd'}
                  value={formData.userPwd}
                  containerBottom={'25px'}
                  width={'400px'}
                  placeholder={'새로운 비밀번호를 입력하세요'}
                  type='password'
                />
              </>
            ) : (
              <>
                <div>
                  <TextBox>
                    <Asterisk>*</Asterisk>
                    <Text margin={'50px'}>아이디</Text>
                  </TextBox>

                  <InputTextBox
                    inputRef={inputRef}
                    id={'userId'}
                    value={formData.userId}
                    containerBottom={'25px'}
                    width={'400px'}
                    placeholder={'아이디를 입력하세요'}
                    type={'text'}
                  />
                </div>
                <div>
                  <TextBox>
                    <Asterisk>*</Asterisk>
                    <Text margin={'50px'}>이름</Text>
                  </TextBox>

                  <InputTextBox
                    id={'userName'}
                    value={formData.userName}
                    containerBottom={'25px'}
                    width={'400px'}
                    placeholder={'이름를 입력하세요'}
                    type={'text'}
                  />
                </div>
                <div>
                  <TextBox>
                    <Asterisk>*</Asterisk>
                    <Text margin={'50px'}>생년월일</Text>
                  </TextBox>
                  <Date
                    defaultValue={formData.userBirth}
                    data-placeholder='생년월일 선택'
                    type='date'
                    id='userBirth'
                    name='calender'
                    width={'400px'}
                    max={today}
                    marginBottom='45px'
                    required
                  ></Date>
                </div>
              </>
            )}
          </FlexBox>
        </InputContainer>
        {type === 'id' ? (
          <ResultText>
            {responseId !== '' ? (
              isFindId && responseId !== 'fail' ? (
                <div>
                  사용자 아이디는
                  <UserId>{responseId}</UserId>
                  입니다
                </div>
              ) : (
                <>사용자 아이디가 없습니다.</>
              )
            ) : (
              ''
            )}
          </ResultText>
        ) : (
          ''
        )}
        <Button size='lg' onClick={clickHandler}>
          {isCorrectUser ? '비밀번호 설정' : FIND_TYPE[type] + ' 찾기'}
        </Button>

        <DecoFooter />
      </Container>
    </>
  );
}

const Asterisk = styled.span`
  font-weight: 900;
  margin-right: 10px;
  color: ${PRIMARY_COLOR};
`;

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

const FlexBox = styled.div`
  ${({ type }) => {
    return type === 'id'
      ? `display: flex;
        justify-content: space-between;
        `
      : '';
  }}
`;

const Date = styled.input`
  width: ${({ width }) => width};
  height: 34.18px;
  padding: 8px;
  margin-top: 9px;
  margin-bottom: ${({ marginBottom }) => marginBottom};
  border: 2px solid ${GRAY_COLOR};
  position: relative;
  background: url(${logo200}) no-repeat right center;
  border-radius: 8px;
  transition: all 0.1s;
  font-weight: 700;
  z-index: 1;
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

const UserId = styled.span`
  color: ${PRIMARY_COLOR};
  font-weight: 800;
  margin: 0px 10px;
`;

const TextBox = styled.div`
  display: flex;
`;

const InputContainer = styled.div`
  margin-top: 5px;
`;

const Line = styled.hr`
  margin-top: 15px;
  border: 1px solid #eee;
  width: ${(props) => props.width};
  margin-bottom: ${(props) => props.marginBottom};
`;

const Text = styled.p`
  font-weight: 700;
  margin-right: 10px;
`;

const ResultText = styled.div`
  height: 80px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
`;

const Title = styled.div`
  font-weight: 800;
  font-size: 18px;
  color: ${PRIMARY_COLOR};
  margin-right: 10px;
  margin-left: ${(props) => props.margin};
`;

const SignUpHead = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
`;
