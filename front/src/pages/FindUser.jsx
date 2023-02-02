import React from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';

import Button from 'components/common/Button';
import DecoFooter from 'components/common/DecoFooter';

import { PRIMARY_COLOR, WHITE_COLOR } from 'components/common/commonColor';
import PrevButton from 'components/common/PrevButton';

export default function FindUser() {
  const nav = useNavigate();

  return (
    <>
      <PrevButton />
      <Container>
        <SignUpHead>
          <Title>ID 및 PW 찾기</Title>
        </SignUpHead>
        <Line width={'420px'} marginBottom={'45px'} />
        <ButtonContainer>
          <Button size='lg' isOutline onClick={() => nav('id')}>
            ID 찾기
          </Button>
          <Button size='lg' onClick={() => nav('pw')}>
            PW 찾기
          </Button>
        </ButtonContainer>
        <DecoFooter />
      </Container>
    </>
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
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  margin-top: 50px;
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

const SignUpHead = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
`;
