import React from 'react';
import styled from 'styled-components';
import InputTextBox from 'components/common/InputTextBox';
import InputTitle from 'components/common/InputTitle';

export default function Editor() {
  return (
    <Container>
      <Header>
        <Title>팔래요 수정하기</Title>
        <SubText>썸네일을 포함한 이미지를 1장 이상 업로드 해주세요.</SubText>
      </Header>
      <Contents>
        <img />
        <InputTitle
          title='제목 테스트'
          subTitle='서브 타이틀 테스트'
          isRequired
        ></InputTitle>
        <InputTextBox placeholder='플레이스 홀더'></InputTextBox>
      </Contents>
    </Container>
  );
}

const Container = styled.div``;

const Header = styled.div``;

const Title = styled.div``;

const SubText = styled.div``;

const Contents = styled.div``;
