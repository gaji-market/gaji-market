import Card from 'components/common/Card';
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import PlusButton from '../components/common/PlusButton';

export default function ProductView() {
  return (
    <Container>
      <Header>
        <Title>신규 판매중 상품</Title>
        <SubText>따끈따끈! 판매중인 신규 상품 목록이에요.</SubText>
      </Header>

      <CardContainer>
        {Array(20)
          .fill()
          .map((card, i) => {
            return (
              <Card
                key={`테스트용 카드 컴포넌트 key : ${i}`}
                title='title'
                price='123,000'
                area='서울시 동작구'
                likes={i}
              />
            );
          })}
        <div></div>
      </CardContainer>
      <PlusButton />
    </Container>
  );
}

const Container = styled.div`
  width: 1200px;
  position: relative;
`;

const Header = styled.div`
  width: 1024px;
  margin: 0 auto;
  margin-top: 30px;
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 25px;
  font-weight: 900;
  margin-top: 5px;
  margin-bottom: 5px;
  text-indent: 5px;
`;

const SubText = styled.p`
  font-size: 16px;
  padding-top: 7px;
  text-indent: 7px;
`;

const CardContainer = styled.div`
  width: 1024px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  margin: 0 auto;
`;
