import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import logo200 from 'assets/BasicLogo.svg';

import styled from 'styled-components';

import Button from 'components/common/Button';
import DecoFooter from 'components/common/DecoFooter';
import makeToday from 'utils/makeToday';

import {
  PRIMARY_COLOR,
  WHITE_COLOR,
  GRAY_COLOR,
} from 'components/common/commonColor';
import PrevButton from 'components/common/PrevButton';

import InputTextBox from 'components/common/InputTextBox';
import { usePostSearchIdPwMutation } from 'services/signUpApi';

export default function FindDetail() {
  const inputRef = useRef();
  const today = makeToday();
  const [searchIdPw] = usePostSearchIdPwMutation();
  const { type } = useParams();
  const [responseId, setResponseId] = useState('');
  const [isFindId, setIsFindId] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    userBirth: '',
    userName: '',
  });
  const changeHandler = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  const clickHandler = async () => {
    try {
      const res = await searchIdPw(formData).unwrap();
      if (res.msg === 'Success') {
        setResponseId(res.resultId);
        setIsFindId(true);
      } else {
        setResponseId('fail');
      }
    } catch (error) {}
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <>
      <PrevButton />
      <Container>
        <SignUpHead>
          <Title>{type.toUpperCase()} 찾기</Title>
        </SignUpHead>
        <Line width={'420px'} marginBottom={'45px'} />
        <InputContainer onChange={changeHandler}>
          {type === 'id' ? (
            <FlexBox>
              <div>
                <div style={{ display: 'flex' }}>
                  <Asterisk>*</Asterisk>
                  <Text margin={'50px'}>이름</Text>
                </div>

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
              <BirthDayBox>
                <div style={{ display: 'flex' }}>
                  <Asterisk>*</Asterisk>
                  <Text margin={'50px'}>생년월일</Text>
                </div>
                <Date
                  defaultValue={formData.userBirth}
                  data-placeholder='생년월일 선택'
                  type='date'
                  id='userBirth'
                  name='calender'
                  max={today}
                  required
                ></Date>
              </BirthDayBox>
            </FlexBox>
          ) : (
            <></>
          )}
        </InputContainer>
        <ResultText>
          {responseId !== '' ? (
            isFindId && responseId !== 'fail' ? (
              <>
                사용자 아이디는
                <span
                  style={{
                    color: PRIMARY_COLOR,
                    fontWeight: '800',
                    margin: '0px 10px',
                  }}
                >
                  {responseId}
                </span>
                입니다
              </>
            ) : (
              <>사용자 아이디가 없습니다.</>
            )
          ) : (
            ''
          )}
        </ResultText>
        <Button size='lg' onClick={clickHandler}>
          제출
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

const BirthDayBox = styled.div`
  align-items: center;
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
  display: flex;
  justify-content: space-between;
`;
const Date = styled.input`
  width: 180px;
  height: 34.18px;
  padding: 8px;
  margin-top: 9px;
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
  height: 100px;
  padding-top: 30px;
  text-align: center;
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
